/// <reference path="../types/index.d.ts" />
import { History } from "history";
declare function WrapCreateNav<RoutesNameType extends string, ExtraType extends unknown>(routes: InjectNavRouteProps<RoutesNameType, ExtraType>): {
    config: Record<RoutesNameType, RouteItem<ExtraType>>;
    injectMode: (history: History) => void;
    createPath: (name: RoutesNameType, params?: ParamsType, serach?: SearchType | undefined) => string;
    push: (params: RoutesNameType | LocationDescriptorObject<RoutesNameType>) => void;
    replace: (params: RoutesNameType | LocationDescriptorObject<RoutesNameType>) => void;
    pushCall: (params: RoutesNameType | LocationDescriptorObject<RoutesNameType>) => () => void;
    replaceCall: (params: RoutesNameType | LocationDescriptorObject<RoutesNameType>) => () => void;
};
export default WrapCreateNav;
