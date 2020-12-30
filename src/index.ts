import { History } from "history"

interface RouteItem {
    name: string
    path: string
}

class ReactRouterNav <RouteProps extends RouteItem = any> {
    protected History: History
    protected Routes: Record<string,string> = {}
    constructor(history: History,routes: Array<RouteProps>){
        this.History = history
        this.inject(routes)
    }
    // 对象转换为序列字符串
    private stringify(search: string | object = {}): string{
        let params = ""
        if(typeof search === "string"){
            params = search
        }else{
            params = Object.keys(search).map(k => `${k}=${search[k]}`).join("&")
        }
        return params
    }
    private inject(routes: Array<RouteItem>){
        routes.map(item => {
            if(this.Routes.hasOwnProperty(item.name)){
                console.error(`route-name(${item.name})有重复，请重命名`)
            }else{
                this.Routes[item.name] = item.path
            }
        })
    }
    // 获取pathname
    public GetPathFromName(name: string,params = {}) : string | void{
        const path = this.Routes[name]
        if(path){
            return path.replace(/\/:(\w+)/g,(_,k) => {
                if(params.hasOwnProperty(k)){
                    return '/' + params[k]
                }else{
                    console.error(`路由${name}缺少参数:${k}`)
                    return ''
                }
            })
        }else{
            console.error(`没有找到${name}路由`)
        }
    }
    // 获取完整路径
    public GetHrefFromName(name: string,params = {},search: string | object = {}): string | void{
        const fullpath = this.GetPathFromName(name,params)
        if(fullpath){
            const pathname = this.History.createHref({pathname: fullpath,search: this.stringify(search)})
            return window.location.origin + ('/' + pathname).replace('//','')
        }
    }
    public push(name: string,params = {},search: string | object = {}): void{
        const fullpath = this.GetPathFromName(name,params)
        if(fullpath){
            this.History.push({pathname: fullpath,search: this.stringify(search)})
        }
    }
    public replace(name: string,params = {},search: string | object = {}): void{
        const fullpath = this.GetPathFromName(name,params)
        if(fullpath){
            this.History.replace({pathname: fullpath,search: this.stringify(search)})
        }
    }
    public pushCall(name: string,params = {},search: string | object = {}): () => void{
        return () => this.push(name,params,search)
    }
    public replaceCall(name: string,params = {},search: string | object = {}): () => void{
        return () => this.replace(name,params,search)
    }
}

export default ReactRouterNav