import { History } from "history"
import { matchPath , generatePath , RouteProps } from "react-router"

namespace ReactRouterNavModule {
    export interface RouteItem extends RouteProps {
        name: string
        path: string
    }
    export type NameReference = string
    export type ParamsReference = object
    export type SearchReference = string | object
    export type Reference<ReturnType = void> = (name: NameReference,params?: ParamsReference,search?: SearchReference) => ReturnType
}

interface ReactRouterNav {
    GetNameFromPath(pathname: string): string
    GetPathFromName(name: ReactRouterNavModule.NameReference,params?: ReactRouterNavModule.ParamsReference): string
    GetHrefFromName: ReactRouterNavModule.Reference<string>
    push: ReactRouterNavModule.Reference<string | void>
    replace: ReactRouterNavModule.Reference<string | void>
    pushCall: ReactRouterNavModule.Reference<() => void>
    replaceCall: ReactRouterNavModule.Reference<() => void>
}

let History: History
const NaturalRoutes: Array<ReactRouterNavModule.RouteItem> = []
const Routes: Record<string,ReactRouterNavModule.RouteItem> = {}

function stringify(search: string | object = {}): string{
    let params = ""
    if(typeof search === "string"){
        params = search
    }else{
        params = Object.keys(search).map(k => `${k}=${search[k]}`).join("&")
    }
    return params
}

export function InjectNavRoutes(routes: Array<ReactRouterNavModule.RouteItem> = []){
    routes.map(item => {
        if(Routes.hasOwnProperty(item.name)){
            console.error(`route-name(${item.name})有重复，请重命名`)
        }else{
            NaturalRoutes.push(item)
            Routes[item.name] = item
        }
    })
}

export function InjectNavModel(history: History,routes: Array<ReactRouterNavModule.RouteItem> = []){
    History = history
    InjectNavRoutes(routes)
}

const ReactRouterNav: ReactRouterNav = {
    // 获取路由名称
    GetNameFromPath(pathname) {
        const serachResult = NaturalRoutes.filter(item => {
            const { path , exact , strict } = item
            const result  = matchPath(pathname,{path , exact , strict })
            return result ? true : false
        })
        return serachResult.length ? serachResult[0].name : ""
    },
    // 获取pathname
    GetPathFromName(name,params = {}){
        const { path } = Routes[name]
        if(path){
            return generatePath(path , params)
        }else{
            console.error(`没有找到${name}路由`)
            return '/'
        }
    },
    // 获取完整路径
    GetHrefFromName(name,params = {},search = {}){
        const fullpath = this.GetPathFromName(name,params)
        const pathname = History.createHref({pathname: fullpath,search: stringify(search)})
        return window.location.origin + ('/' + pathname).replace(/\/+/g,'/')
    },
    push(name,params = {},search = {}){
        const fullpath = this.GetPathFromName(name,params)
        History.push({pathname: fullpath,search: stringify(search)})
    },
    replace(name,params = {},search = {}){
        const fullpath = this.GetPathFromName(name,params)
        History.replace({pathname: fullpath,search: stringify(search)})
    },
    pushCall(name,params = {},search = {}){
        return () => this.push(name,params,search)
    },
    replaceCall(name,params = {},search = {}){
        return () => this.replace(name,params,search)
    }
}

export default ReactRouterNav