/// <reference path="../types/index.d.ts" />

import { History } from "history"
import { generatePath , match , matchPath } from "react-router"
import { Tools } from "./utils"

interface IController {
	history?: History
}

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
			current: {name: RoutesNameType} & match<Params>
			path: ({name: RoutesNameType} & match<Params>)[]
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

	// 合成url
	function createPath(name: RoutesNameType, params: ParamsType = {},serach?: SearchType){
		const currentPamars = GetRoutePunctuation()?.current!.params || {}
		const path = generatePath(routeTable[name], {...currentPamars, ...params})
		const serachStr = Tools.stringify(serach)
		return serachStr ? `${path}?${serachStr}`: path
	}

	// push
	function push(params: RoutesNameType | LocationDescriptorObject<RoutesNameType>) {
		const history = controller.history
		if(history) {
			if(typeof params === "string") {
				history.push(routeTable[params])
			} else {
				const pathname = createPath(params.name, params.params)
				const search = Tools.stringify(params.search)
				history.push({
					pathname,
					search,
					state: params.state
				})
			}
		}
	}
	// replace
	function replace(params: RoutesNameType | LocationDescriptorObject<RoutesNameType>) {
		const history = controller.history
		if(history) {
			if(typeof params === "string") {
				history.replace(routeTable[params])
			} else {
				const pathname = createPath(params.name, params.params)
				const search = Tools.stringify(params.search)
				history.replace({
					pathname,
					search,
					state: params.state
				})
			}
		}
	}
	// pushCall
	function pushCall(params: RoutesNameType | LocationDescriptorObject<RoutesNameType>) {
		return () => push(params)
	}
	// replaceCall
	function replaceCall(params: RoutesNameType | LocationDescriptorObject<RoutesNameType>) {
		return () => replace(params)
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