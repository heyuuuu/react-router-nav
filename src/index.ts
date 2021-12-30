import * as H from "history"
import { useEffect } from "react"
import { useHistory, generatePath, matchPath } from "react-router-dom"

function reactRouterNav<
	HistoryName extends string,
	ActionName extends string,
	ExtraProps extends NavSpace.OBJECT,
>(list: NavSpace.Props<ActionName, ExtraProps>[], historyNames: HistoryName[]) {

	type Item = NavSpace.Props<ActionName, ExtraProps>
	type Props = NavSpace.NavigationParams<ActionName>

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

	// 计算路径
	function computePath(...[action, params, search = "", state]: Props) {
		const config = typeof action === "string"
			? {name: action, params, search, state}
			: action
		const path = generatePath(distributionData.RoutePathMaps[config.name], params as any)
		const query = typeof search === "string" 
			? search
			: Object.keys(search).map(name => `${name}=${search[name]}`).join("&")
		return {path, query, state}
	}

	// 生成路径
	const createPath = (...props: Props) => {
		return computePath(...props).path
	}

	// 生成完整路径
	const createFullPath = (...props: Props) => {
		const { path, query } = computePath(...props)
		return query ? path + "?" + query : path
	}

	// 导航
	function createRouteNav(action: HistoryName | H.History) {
		
		const currentHistory = typeof action === "string" ? routeStack[action] : action

		const push = (...params: Props) => {
			const { path, query, state } = computePath(...params)
			currentHistory?.push({pathname: path, search: query, state})
		}

		const replace = (...params: Props) => {
			const { path, query, state } = computePath(...params)
			currentHistory?.replace({pathname: path, search: query, state})
		}

		return {
			push,
			replace
		}
	}

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
		createFullPath, // 创建完整路径
		createRouteNav, // 创建路由导航
		useRouterNav, // 基于hooks使用路由导航
		routeStack, // 获取当前路由栈中所有history
		addHistory, // 添加一个history
		removeHistory, // 移除一个histroy
        useInjectHistory, // 使用hooks快速注入一个路由栈
		RouteList: distributionData.RouteList,
		RoutePathMaps: distributionData.RoutePathMaps,
		RouteNameConfig: distributionData.RouteNameConfig,
	}
}

reactRouterNav([
	{name: "home", path: "/home"}
], ["wuming"]).createRouteNav("wuming")

export default reactRouterNav