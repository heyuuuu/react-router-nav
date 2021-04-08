import { History } from "history";
import { RouteProps } from "react-router";
declare namespace ReactRouterNavModule {
    interface RouteItem extends RouteProps {
        name: string;
        path: string;
    }
    type NameReference = string;
    type ParamsReference = object;
    type SearchReference = string | object;
    interface Reference<ReturnType = void> {
        (name: NameReference, params?: ParamsReference, search?: SearchReference): ReturnType;
    }
}
interface ReactRouterNav {
    GetNameFromPath(pathname: string): string;
    GetPathFromName(name: ReactRouterNavModule.NameReference, params: ReactRouterNavModule.ParamsReference): string;
    GetHrefFromName: ReactRouterNavModule.Reference<string>;
    push: ReactRouterNavModule.Reference<string | void>;
    replace: ReactRouterNavModule.Reference<string | void>;
    pushCall: ReactRouterNavModule.Reference<() => void>;
    replaceCall: ReactRouterNavModule.Reference<() => void>;
}
declare let History: History;
export declare function InjectNavModel<RouteProps extends ReactRouterNavModule.RouteItem = any>(history: History, routes?: Array<RouteProps>): void;
declare const ReactRouterNav: ReactRouterNav;
export default ReactRouterNav;
