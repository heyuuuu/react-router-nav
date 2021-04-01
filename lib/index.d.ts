import { History } from "history";
import { RouteProps } from "react-router";
interface RouteItem extends RouteProps {
    name: string;
    path: string;
}
declare type PARAMS_TYPE = [string] | [string, object] | [string, object, string | object];
declare let History: History;
export declare function InjectNavModel<RouteProps extends RouteItem = any>(history: History, routes?: Array<RouteProps>): void;
declare const ReactRouterNav: {
    GetNameFromPath(pathname: string): string;
    GetPathFromName(name: string, params?: {}): string;
    GetHrefFromName(...[name, params, search]: PARAMS_TYPE): string | void;
    push(...[name, params, search]: PARAMS_TYPE): void;
    replace(...[name, params, search]: PARAMS_TYPE): void;
    pushCall(...[name, params, search]: PARAMS_TYPE): () => void;
    replaceCall(...[name, params, search]: PARAMS_TYPE): () => void;
};
export default ReactRouterNav;
