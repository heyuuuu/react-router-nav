import { History } from "history"
import { matchPath , generatePath , RouteProps } from "react-router"

interface RouteItem extends RouteProps {
    name: string
    path: string
}
 
type PARAMS_TYPE = [string] | [string,object] | [string,object,string | object]

let History: History
let NaturalRoutes: Array<RouteItem> = []
let Routes: Record<string,RouteItem> = {}

function stringify(search: string | object = {}): string{
    let params = ""
    if(typeof search === "string"){
        params = search
    }else{
        params = Object.keys(search).map(k => `${k}=${search[k]}`).join("&")
    }
    return params
}

function InjectNavRoutes<RouteProps extends RouteItem = any>(routes: Array<RouteProps> = []){
    NaturalRoutes = NaturalRoutes.concat(routes)
    routes.map(item => {
        if(Routes.hasOwnProperty(item.name)){
            console.error(`route-name(${item.name})有重复，请重命名`)
        }else{
            Routes[item.name] = item
        }
    })
}

export function InjectNavModel<RouteProps extends RouteItem = any>(history: History,routes: Array<RouteProps> = []){
    History = history
    InjectNavRoutes(routes)
}

const ReactRouterNav = {
    // 获取路由名称
    GetNameFromPath(pathname: string): string {
        const serachResult = NaturalRoutes.filter(item => {
            const { path , exact , strict } = item
            const result  = matchPath(pathname,{path , exact , strict })
            return result ? true : false
        })
        return serachResult.length ? serachResult[0].name : ""
    },
    // 获取pathname
    GetPathFromName(name: string,params = {}) : string{
        const { path } = Routes[name]
        if(path){
            return generatePath(path , params)
        }else{
            console.error(`没有找到${name}路由`)
            return '/'
        }
    },
    // 获取完整路径
    GetHrefFromName(...[name,params = {},search = {}]: PARAMS_TYPE): string | void{
        const fullpath = this.GetPathFromName(name,params)
        const pathname = History.createHref({pathname: fullpath,search: stringify(search)})
        return window.location.origin + ('/' + pathname).replace(/\/+/g,'/')
    },
    push(...[name,params = {},search = {}]: PARAMS_TYPE): void{
        const fullpath = this.GetPathFromName(name,params)
        History.push({pathname: fullpath,search: stringify(search)})
    },
    replace(...[name,params = {},search = {}]: PARAMS_TYPE): void{
        const fullpath = this.GetPathFromName(name,params)
        History.replace({pathname: fullpath,search: stringify(search)})
    },
    pushCall(...[name,params = {},search = {}]: PARAMS_TYPE): () => void{
        return () => this.push(name,params,search)
    },
    replaceCall(...[name,params = {},search = {}]: PARAMS_TYPE): () => void{
        return () => this.replace(name,params,search)
    }
}

export default ReactRouterNav