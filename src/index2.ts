/// <reference path="../types/index.d.ts" />

import { History } from "history"
import { generatePath } from "react-router"
import { Tools } from "./utils"

function WrapCreateNav<RoutesNameType extends string, ExtraType extends unknown>(routes: InjectNavRouteProps<RoutesNameType, ExtraType> ) {
	
	// @ts-ignore
	const config: Record<RoutesNameType, RouteItem<ExtraType>> = {}
	// @ts-ignore
	const routeTable: Record<RoutesNameType, string> = {}

	let history: History

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
	function injectMode(history: History) {
		history = history
	}

	// 合成url
	function createPath(name: RoutesNameType, params: ParamsType = {},serach?: SearchType){
		const path = generatePath(config[name].path, params)
		return [path,'?',Tools.stringify(serach)].join('')
	}

	// push
	function push(params: RoutesNameType | LocationDescriptorObject<RoutesNameType>) {
		if(history) {
			if(typeof params === "string") {
				history.replace(params)
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
	// replace
	function replace(params: RoutesNameType | LocationDescriptorObject<RoutesNameType>) {
		if(history) {
			if(typeof params === "string") {
				history.replace(params)
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

	return {
		config,
		routeTable,
		injectMode,
		createPath,
		push,
		replace,
		pushCall,
		replaceCall
	}
}

export default WrapCreateNav