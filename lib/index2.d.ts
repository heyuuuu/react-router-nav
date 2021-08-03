/// <reference path="../types/index.d.ts" />
import { History } from "history";
import { match } from "react-router";
declare type TName<Props> = Props | LocationDescriptorObject<Props>;
declare type TPath<RoutesNameType, Props> = {
    name: RoutesNameType;
} & match<Props>;
declare type TParamsProps<RoutesNameType> = [
    TName<RoutesNameType>
] | [
    TName<RoutesNameType>,
    ParamsType | undefined
] | [
    TName<RoutesNameType>,
    ParamsType | undefined,
    SearchType | undefined
];
declare function WrapCreateNav<RoutesNameType extends string, ExtraType extends unknown>(routes: InjectNavRouteProps<RoutesNameType, ExtraType>): {
    ready: (callback: (history: History) => void) => History<unknown> | undefined;
    config: Record<RoutesNameType, RouteItem<ExtraType>>;
    routeTable: Record<RoutesNameType, string>;
    injectMode: (currentHistory: History) => void;
    createPath: (name: RoutesNameType, params?: ParamsType, serach?: SearchType | undefined) => string;
    push: (...[wildcard, params, search]: TParamsProps<RoutesNameType>) => void;
    replace: (...[wildcard, params, search]: TParamsProps<RoutesNameType>) => void;
    pushCall: (...[wildcard, params, search]: TParamsProps<RoutesNameType>) => () => void;
    replaceCall: (...[wildcard, params, search]: TParamsProps<RoutesNameType>) => () => void;
    GetRoutePunctuation: <Params = any>(H?: History<unknown> | undefined) => {
        current: TPath<RoutesNameType, Params>;
        path: TPath<RoutesNameType, Params>[];
    } | undefined;
};
export default WrapCreateNav;
