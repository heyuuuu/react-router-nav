import { History } from "history";
interface RouteItem {
    name: string;
    path: string;
}
declare class ReactRouterNav<RouteProps extends RouteItem = any> {
    protected History: History;
    protected Routes: Record<string, string>;
    constructor(history: History, routes: Array<RouteProps>);
    private stringify;
    private inject;
    GetPathFromName(name: string, params?: {}): string | void;
    GetHrefFromName(name: string, params?: {}, search?: string | object): string | void;
    push(name: string, params?: {}, search?: string | object): void;
    replace(name: string, params?: {}, search?: string | object): void;
    pushCall(name: string, params?: {}, search?: string | object): () => void;
    replaceCall(name: string, params?: {}, search?: string | object): () => void;
}
export default ReactRouterNav;
