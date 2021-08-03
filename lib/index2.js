"use strict";
/// <reference path="../types/index.d.ts" />
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_router_1 = require("react-router");
var utils_1 = require("./utils");
function WrapCreateNav(routes) {
    // @ts-ignore
    var config = {};
    // @ts-ignore
    var routeTable = {};
    var controller = {};
    injectRoutes(routes);
    function injectRoutes(routes) {
        var combination = function (routes, parentName, parentPath) {
            if (parentName === void 0) { parentName = ""; }
            if (parentPath === void 0) { parentPath = ""; }
            routes.forEach(function (item) {
                var name = item.name.replace(/^(\.)/, parentName + "$1").replace(/^(\$)/, "" + parentName);
                if (config[name]) {
                    console.warn("react-router-nav: \u5B58\u5728\u91CD\u590D\u8DEF\u7531\u540D(" + name + ")");
                }
                else {
                    var path = parentPath + item.path;
                    config[name] = { path: path, extra: item.extra };
                    routeTable[name] = path;
                    if (item.routes) {
                        combination(item.routes, name, path);
                    }
                }
            });
        };
        combination(routes);
    }
    // 注入路由管理
    function injectMode(currentHistory) {
        controller.history = currentHistory;
    }
    // 获取当前路径
    function GetRoutePunctuation(H) {
        if (H === void 0) { H = controller.history; }
        var result = {
            current: {},
            path: []
        };
        if (H) {
            var pathname_1 = H.location.pathname;
            Object.keys(routeTable).forEach(function (name) {
                var data = react_router_1.matchPath(pathname_1, { path: routeTable[name] });
                if (data !== null) {
                    var item = __assign(__assign({}, data), { name: name });
                    result.path.push(item);
                    if (data.isExact) {
                        result.current = item;
                    }
                }
            });
            if (result.current.name) {
                return result;
            }
        }
    }
    // 合成pathname
    function createPathname(name, params) {
        var _a;
        if (params === void 0) { params = {}; }
        var path = routeTable[name];
        var currentPamars = ((_a = GetRoutePunctuation()) === null || _a === void 0 ? void 0 : _a.current.params) || {};
        var pathname = react_router_1.generatePath(path, __assign(__assign({}, currentPamars), params));
        return pathname;
    }
    // 合成url
    function createPath(name, params, serach) {
        if (params === void 0) { params = {}; }
        var pathname = createPathname(name, params);
        var serachStr = utils_1.Tools.stringify(serach);
        return serachStr ? pathname + "?" + serachStr : pathname;
    }
    // 转换参数
    function transfromName() {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var wildcard = _a[0], _b = _a[1], params = _b === void 0 ? {} : _b, search = _a[2];
        if (typeof wildcard === "string") {
            var pathname = createPathname(wildcard, params);
            var searchStr = utils_1.Tools.stringify(search);
            return {
                pathname: pathname,
                search: searchStr
            };
        }
        else {
            var name_1 = wildcard.name, params_1 = wildcard.params, search_1 = wildcard.search, state = wildcard.state;
            var pathname = createPath(name_1, params_1);
            var searchStr = utils_1.Tools.stringify(search_1);
            return {
                pathname: pathname,
                state: state,
                search: searchStr
            };
        }
    }
    // push
    function push() {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var wildcard = _a[0], _b = _a[1], params = _b === void 0 ? {} : _b, _c = _a[2], search = _c === void 0 ? {} : _c;
        var history = controller.history;
        if (history) {
            history.push(transfromName(wildcard, params, search));
        }
    }
    // replace
    function replace() {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var wildcard = _a[0], params = _a[1], search = _a[2];
        var history = controller.history;
        if (history) {
            history.replace(transfromName(wildcard, params, search));
        }
    }
    // pushCall
    function pushCall() {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var wildcard = _a[0], params = _a[1], search = _a[2];
        return function () { return push(wildcard, params, search); };
    }
    // replaceCall
    function replaceCall() {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var wildcard = _a[0], params = _a[1], search = _a[2];
        return function () { return replace(wildcard, params, search); };
    }
    // ready
    function ready(callback) {
        if (controller.history) {
            callback(controller.history);
        }
        return controller.history;
    }
    return {
        ready: ready,
        config: config,
        routeTable: routeTable,
        injectMode: injectMode,
        createPath: createPath,
        push: push,
        replace: replace,
        pushCall: pushCall,
        replaceCall: replaceCall,
        GetRoutePunctuation: GetRoutePunctuation
    };
}
exports.default = WrapCreateNav;
