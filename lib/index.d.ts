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
    type Reference<ReturnType = void> = (name: NameReference, params?: ParamsReference, search?: SearchReference) => ReturnType;
}
interface ReactRouterNav {
    GetNameFromPath(pathname: string): string;
    GetPathFromName(name: ReactRouterNavModule.NameReference, params?: ReactRouterNavModule.ParamsReference): string;
    GetHrefFromName: ReactRouterNavModule.Reference<string>;
    push: ReactRouterNavModule.Reference<string | void>;
    replace: ReactRouterNavModule.Reference<string | void>;
    pushCall: ReactRouterNavModule.Reference<() => void>;
    replaceCall: ReactRouterNavModule.Reference<() => void>;
}
declare let History: History;
export declare function InjectNavRoutes(routes?: Array<ReactRouterNavModule.RouteItem>): void;
export declare function InjectNavModel(history: History, routes?: Array<ReactRouterNavModule.RouteItem>): void;
declare const ReactRouterNav: ReactRouterNav;
export default ReactRouterNav;
