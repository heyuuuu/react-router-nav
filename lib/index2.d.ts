/// <reference path="../types/index.d.ts" />
import { History } from "history";
import { match } from "react-router";
declare function WrapCreateNav<RoutesNameType extends string, ExtraType extends unknown>(routes: InjectNavRouteProps<RoutesNameType, ExtraType>): {
    ready: (callback: (history: History) => void) => History<unknown> | undefined;
    config: Record<RoutesNameType, RouteItem<ExtraType>>;
    routeTable: Record<RoutesNameType, string>;
    injectMode: (currentHistory: History) => void;
    createPath: (name: RoutesNameType, params?: ParamsType, serach?: SearchType | undefined) => string;
    push: (params: RoutesNameType | LocationDescriptorObject<RoutesNameType>) => void;
    replace: (params: RoutesNameType | LocationDescriptorObject<RoutesNameType>) => void;
    pushCall: (params: RoutesNameType | LocationDescriptorObject<RoutesNameType>) => () => void;
    replaceCall: (params: RoutesNameType | LocationDescriptorObject<RoutesNameType>) => () => void;
    GetRoutePunctuation: <Params = any>(H?: History<unknown> | undefined) => {
        current?: ({
            name: RoutesNameType;
        } & match<Params>) | undefined;
        path: ({
            name: RoutesNameType;
        } & match<Params>)[];
    } | undefined;
};
export default WrapCreateNav;
