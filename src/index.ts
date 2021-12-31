/// <reference path="../types/index.d.ts" />

import * as H from "history"
import { useEffect } from "react"
import { useHistory, generatePath } from "react-router-dom"

function reactRouterNav<
	HistoryName extends string,
	ActionName extends string,
	ExtraProps extends NavSpace.OBJECT,
>(list: NavSpace.Props<ActionName, ExtraProps>[], historyNames?: HistoryName[]) {

	type Item = NavSpace.Props<ActionName, ExtraProps>
	type Params = NavSpace.NavigationParams<ActionName>

	// 本地存储路由栈
	const routeStack = {} as Record<HistoryName, H.History>
	// 暂存变量
	const distributionData = {
		// 路由配置列表
		RouteList: [] as Item[],
		// 路由路由映射
		RoutePathMaps: {} as Record<ActionName, string>,
		// 路由配置映射
		RouteNameConfig: {} as Record<ActionName, Item>,
	}
	// 转换路径
	{
		const mergePath = (name: ActionName): string => {
			const prevPath = distributionData.RoutePathMaps[name] || ""
			if(prevPath) {
				const calculatePath = prevPath.replace(/\{([\w_]+)\}/g, (_, name) => mergePath(name))
				return distributionData.RoutePathMaps[name] = calculatePath
			} else {
				return prevPath
			}
		}
		list.forEach(item => {
			distributionData.RoutePathMaps[item.name] = item.path
			distributionData.RouteNameConfig[item.name] = item
			distributionData.RouteList.push(item)
		})
		distributionData.RouteList.forEach(item => item.path = mergePath(item.name))
	}

	// 解析入参
	function transformParams(action: Params): NavSpace.NavigationProps<ActionName> {
		if(action instanceof Array) {
			const [name, params, search, state] = action
			return { name, params: params || undefined, search: search || undefined, state }
		}
		if(typeof action === "object") {
			return action
		}
		return {
			name: action
		}
	}

	// 计算路径
	function computePath(props: Params) {
		const { name, params, search = '', state } = transformParams(props)
		const path = generatePath(distributionData.RoutePathMaps[name], params as any)
		const query = typeof search === "string" 
			? search
			: Object.keys(search).map(name => `${name}=${search[name]}`).join("&")
		return {path, query, state}
	}

	// 生成路径
	function createPath(params: Params, location?: boolean | {
		protocol?: string
		host?: string
	}) {
		const { path, query } = computePath(params)
		const pathname = query ? path + "?" + query : path
		if(location) {
			const { 
				protocol = window.location.protocol,
				host = window.location.host 
			} = typeof location === "object" ? location : {}
			return protocol + host + pathname
		} else {
			return pathname
		}
	}

	// 创建nav
	function createRouteNav(action: HistoryName | H.History) {
		
		const currentHistory = typeof action === "string" ? routeStack[action] : action

		const push = (params: Params) => {
			const { path, query, state } = computePath(params)
			currentHistory?.push({pathname: path, search: query, state})
		}

		const replace = (params: Params) => {
			const { path, query, state } = computePath(params)
			currentHistory?.replace({pathname: path, search: query, state})
		}

		const callPush = (params: Params) => push(params)

		const callReplace = (params: Params) => replace(params)

		return {
			push,
			callPush,
			replace,
			callReplace
		}
	}

	// hooks
	function useRouterNav() {
		const currentHistory = useHistory()
		return createRouteNav(currentHistory)
	}

	// 添加路由栈
	function addHistory(name: HistoryName, history: H.History) {
		routeStack[name] = history
		return routeStack[name]
	}

	// 移除路由栈
	function removeHistory(name: HistoryName) {
		delete routeStack[name]
	}

    function useInjectHistory(name: HistoryName) {
        const currentHistory = useHistory()
        useEffect(() => {
            addHistory(name, currentHistory)
            return () => {
                removeHistory(name)
            }
        }, [])
    }

	return {
		createPath, // 创建路径
		createRouteNav, // 创建路由导航
		useRouterNav, // 基于hooks使用路由导航
		routeStack, // 获取当前路由栈中所有history
		addHistory, // 添加一个history
		removeHistory, // 移除一个histroy
        useInjectHistory, // 使用hooks快速注入一个路由栈
		routeList: distributionData.RouteList,
		routePathMaps: distributionData.RoutePathMaps,
		routeNameConfig: distributionData.RouteNameConfig,
	}
}

export default reactRouterNav