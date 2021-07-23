"use strict";
/// <reference path="../types/index.d.ts" />
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
    // 合成url
    function createPath(name, params, serach) {
        if (params === void 0) { params = {}; }
        var path = react_router_1.generatePath(config[name].path, params);
        var serachStr = utils_1.Tools.stringify(serach);
        return serachStr ? path + "?" + serachStr : path;
    }
    // push
    function push(params) {
        var history = controller.history;
        if (history) {
            if (typeof params === "string") {
                history.push(routeTable[params]);
            }
            else {
                var pathname = createPath(params.name, params.params);
                var search = utils_1.Tools.stringify(params.search);
                history.push({
                    pathname: pathname,
                    search: search,
                    state: params.state
                });
            }
        }
    }
    // replace
    function replace(params) {
        var history = controller.history;
        if (history) {
            if (typeof params === "string") {
                history.replace(routeTable[params]);
            }
            else {
                var pathname = createPath(params.name, params.params);
                var search = utils_1.Tools.stringify(params.search);
                history.replace({
                    pathname: pathname,
                    search: search,
                    state: params.state
                });
            }
        }
    }
    // pushCall
    function pushCall(params) {
        return function () { return push(params); };
    }
    // replaceCall
    function replaceCall(params) {
        return function () { return replace(params); };
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
        replaceCall: replaceCall
    };
}
exports.default = WrapCreateNav;
