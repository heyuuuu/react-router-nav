/// <reference path="../types/index.d.ts" />
import { History } from "history";
import { match } from "react-router";
declare type TName<Props> = Props | LocationDescriptorObject<Props>;
declare type TPath<RoutesNameType, Props> = {
    name: RoutesNameType;
} & match<Props>;
declare function WrapCreateNav<RoutesNameType extends string, ExtraType extends unknown>(routes: InjectNavRouteProps<RoutesNameType, ExtraType>): {
    ready: (callback: (history: History) => void) => History<unknown> | undefined;
    config: Record<RoutesNameType, RouteItem<ExtraType>>;
    routeTable: Record<RoutesNameType, string>;
    injectMode: (currentHistory: History) => void;
    createPath: (name: RoutesNameType, params?: ParamsType, serach?: SearchType | undefined) => string;
    push: (__0_0: TName<RoutesNameType>, __0_1: ParamsType | undefined, __0_2: SearchType | undefined) => void;
    replace: (__0_0: TName<RoutesNameType>, __0_1: ParamsType | undefined, __0_2: SearchType | undefined) => void;
    pushCall: (__0_0: TName<RoutesNameType>, __0_1: ParamsType | undefined, __0_2: SearchType | undefined) => () => void;
    replaceCall: (__0_0: TName<RoutesNameType>, __0_1: ParamsType | undefined, __0_2: SearchType | undefined) => () => void;
    GetRoutePunctuation: <Params = any>(H?: History<unknown> | undefined) => {
        current: TPath<RoutesNameType, Params>;
        path: TPath<RoutesNameType, Params>[];
    } | undefined;
};
export default WrapCreateNav;
