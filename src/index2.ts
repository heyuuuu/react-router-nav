/// <reference path="../types/index.d.ts" />

import { History } from "history"
import { generatePath , match , matchPath } from "react-router"
import { Tools } from "./utils"

interface IController {
	history?: History
}
type TName<Props> = Props | LocationDescriptorObject<Props>
type TPath<RoutesNameType,Props> = {name: RoutesNameType} & match<Props>
type TParamsProps<RoutesNameType> =  
	[TName<RoutesNameType>] | 
	[TName<RoutesNameType>, ParamsType | undefined] |
	[TName<RoutesNameType>, ParamsType | undefined, SearchType | undefined]

function WrapCreateNav<RoutesNameType extends string, ExtraType extends unknown>(routes: InjectNavRouteProps<RoutesNameType, ExtraType> ) {
	
	// @ts-ignore
	const config: Record<RoutesNameType, RouteItem<ExtraType>> = {}
	// @ts-ignore
	const routeTable: Record<RoutesNameType, string> = {}

	const controller: IController = {}

	injectRoutes(routes as any)

	function injectRoutes(routes: InjectNavRouteProps<RoutesNameType, ExtraType>) {
		const combination = (routes: InjectNavRouteProps<RoutesNameType, ExtraType>, parentName = "", parentPath = "") => {
			routes.forEach(item => {
				const name = item.name.replace(/^(\.)/, `${parentName}$1`).replace(/^(\$)/, `${parentName}`)
				if(config[name]){
					console.warn(`react-router-nav: 存在重复路由名(${name})`)
				}else{
					const path = parentPath + item.path
					config[name] = {path: path, extra: item.extra}
					routeTable[name] = path
					if(item.routes) {
						combination(item.routes, name, path)
					}
				}
			})
		}
		combination(routes)
	}

	// 注入路由管理
	function injectMode(currentHistory: History) {
		controller.history = currentHistory
	}

	// 获取当前路径
	function GetRoutePunctuation<Params = any>(H = controller.history) {
		const result: {
			current: TPath<RoutesNameType,Params>
			path: TPath<RoutesNameType,Params>[]
		} = {
			current: {} as any,
			path: []
		}
		if(H) {
			const pathname = H.location.pathname
			Object.keys(routeTable).forEach(name => {
				const data = matchPath<Params>(pathname,{path: routeTable[name]})
				if(data !== null) {
					const item = {...data, name: name as RoutesNameType}
					result.path.push(item)
					if(data.isExact) {
						result.current = item
					}
				}
			})
			if(result.current.name) {
				return result
			}
		}
	}

	// 合成pathname
	function createPathname(name: RoutesNameType, params: ParamsType = {}) {
		const path = routeTable[name]
		const currentPamars = GetRoutePunctuation()?.current.params || {}
		const pathname = generatePath(path, {...currentPamars, ...params})
		return pathname
	}

	// 合成url
	function createPath(name: RoutesNameType, params: ParamsType = {},serach?: SearchType){
		const pathname = createPathname(name, params)
		const serachStr = Tools.stringify(serach)
		return serachStr ? `${pathname}?${serachStr}`: pathname
	}

	// 转换参数
	function transfromName(...[wildcard,params = {},search]: TParamsProps<RoutesNameType>): History.LocationDescriptor {
		if(typeof wildcard === "string") {
			const pathname = createPathname(wildcard, params)
			const searchStr = Tools.stringify(search)
			return {
				pathname,
				search: searchStr
			}
		}else{
			const { name , params , search , state } = wildcard
			const pathname = createPath(name, params)
			const searchStr = Tools.stringify(search)
			return {
				pathname,
				state,
				search: searchStr
			}
		}
	}

	// push
	function push(...[wildcard,params = {},search = {}]: TParamsProps<RoutesNameType>) {
		const history = controller.history
		if(history) {
			history.push(transfromName(wildcard,params,search))
		}
	}
	// replace
	function replace(...[wildcard,params,search]: TParamsProps<RoutesNameType>) {
		const history = controller.history
		if(history) {
			history.replace(transfromName(wildcard,params,search))
		}
	}
	// pushCall
	function pushCall(...[wildcard,params,search]: TParamsProps<RoutesNameType>) {
		return () => push(wildcard,params,search)
	}
	// replaceCall
	function replaceCall(...[wildcard,params,search]: TParamsProps<RoutesNameType>) {
		return () => replace(wildcard,params,search)
	}

	// ready
	function ready(callback: (history: History) => void){
		if(controller.history) {
			callback(controller.history)
		}
		return controller.history
	}

	return {
		ready,
		config,
		routeTable,
		injectMode,
		createPath,
		push,
		replace,
		pushCall,
		replaceCall,
		GetRoutePunctuation
	}
}

export default WrapCreateNav