import * as H from "history"
import { useEffect } from "react"
import { useHistory, generatePath, matchPath } from "react-router-dom"

interface Props<ActionName = unknown, ExtraProps = unknown> {
	name: ActionName
	path: string
	params?: ExtraProps
}

interface NavigationProps<ActionName> {
	name: ActionName
	params?: NavSpace.OBJECT
	search?: NavSpace.OBJECT | string
	state?: NavSpace.OBJECT
}

type NavigationParams<ActionName> = [
    ActionName | NavigationProps<ActionName>,
    NavSpace.OBJECT?,
    (NavSpace.OBJECT | string)?,
    NavSpace.OBJECT?
]

function reactRouterNav<
	HistoryName extends string = string,
	ExtraProps extends NavSpace.OBJECT = NavSpace.OBJECT,
	ActionName extends string = string
>(list: Readonly<Props<ActionName, ExtraProps>[]>) {
	// 本地存储路由栈
	const routeStack = <Record<HistoryName, H.History>>{}
	// 暂存变量
	const distributionData = {
		// 路由配置列表
		RouteList: <Props[]>[],
		// 路由路由映射
		RoutePathMaps: <Record<ActionName, string>>{},
		// 路由配置映射
		RouteNameConfig: <Record<ActionName, Props>>{},

	}
	// 转换路径
	{
		const mergePath = (name: ActionName): string => {
			const prevPath = distributionData.RoutePathMaps[name] || ""
			if(prevPath) {
				const calculatePath = prevPath.replace(/\{([\w_]+)\}/g, (_, name) => mergePath(name))
				distributionData.RoutePathMaps[name] = calculatePath
				return calculatePath
			} else {
				return prevPath
			}
		}
		list.forEach(item => {
			distributionData.RoutePathMaps[<ActionName>item.name] = item.path
			distributionData.RouteNameConfig[<ActionName>item.name] = item
			distributionData.RouteList.push(item)
		})
		distributionData.RouteList.forEach(item => item.path = mergePath(<ActionName>item.name))
	}

	// 计算路径
	const computePath = (...[action, params, search = "", state]: NavigationParams<ActionName>) => {
		const config = typeof action === "string"
			? {name: action, params, search, state}
			: action
		const path = generatePath(distributionData.RoutePathMaps[config.name], <any>params)
		const query = typeof search === "string" 
			? search
			: Object.keys(search).map(name => `${name}=${search[name]}`).join("&")
		return {path, query, state}
	}

	// 生成路径
	const createPath = (...props: NavigationParams<ActionName>) => {
		return computePath(...props).path
	}

	// 生成完整路径
	const createFullPath = (...props: NavigationParams<ActionName>) => {
		const { path, query } = computePath(...props)
		return query ? path + "?" + query : path
	}

	// 导航
	function createRouteNav(action: HistoryName | H.History) {
		
		const currentHistory = typeof action === "string" ? routeStack[action] : action

		const push = (...params: NavigationParams<ActionName>) => {
			const { path, query, state } = computePath(...params)
			currentHistory?.push({pathname: path, search: query, state})
		}

		const replace = (...params: NavigationParams<ActionName>) => {
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
		const nav = createRouteNav(currentHistory)
		return nav
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

export default reactRouterNav