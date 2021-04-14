"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectNavModel = exports.InjectNavRoutes = void 0;
var react_router_1 = require("react-router");
var History;
var NaturalRoutes = [];
var Routes = {};
function stringify(search) {
    if (search === void 0) { search = {}; }
    var params = "";
    if (typeof search === "string") {
        params = search;
    }
    else {
        params = Object.keys(search).map(function (k) { return k + "=" + search[k]; }).join("&");
    }
    return params;
}
function InjectNavRoutes(routes) {
    if (routes === void 0) { routes = []; }
    routes.map(function (item) {
        if (Routes.hasOwnProperty(item.name)) {
            console.error("route-name(" + item.name + ")\u6709\u91CD\u590D\uFF0C\u8BF7\u91CD\u547D\u540D");
        }
        else {
            NaturalRoutes.push(item);
            Routes[item.name] = item;
        }
    });
}
exports.InjectNavRoutes = InjectNavRoutes;
function InjectNavModel(history, routes) {
    if (routes === void 0) { routes = []; }
    History = history;
    InjectNavRoutes(routes);
}
exports.InjectNavModel = InjectNavModel;
var ReactRouterNav = {
    // 获取路由名称
    GetNameFromPath: function (pathname) {
        var serachResult = NaturalRoutes.filter(function (item) {
            var path = item.path, exact = item.exact, strict = item.strict;
            var result = react_router_1.matchPath(pathname, { path: path, exact: exact, strict: strict });
            return result ? true : false;
        });
        return serachResult.length ? serachResult[0].name : "";
    },
    // 获取pathname
    GetPathFromName: function (name, params) {
        if (params === void 0) { params = {}; }
        var path = Routes[name].path;
        if (path) {
            return react_router_1.generatePath(path, params);
        }
        else {
            console.error("\u6CA1\u6709\u627E\u5230" + name + "\u8DEF\u7531");
            return '/';
        }
    },
    // 获取完整路径
    GetHrefFromName: function (name, params, search) {
        if (params === void 0) { params = {}; }
        if (search === void 0) { search = {}; }
        var fullpath = this.GetPathFromName(name, params);
        var pathname = History.createHref({ pathname: fullpath, search: stringify(search) });
        return window.location.origin + ('/' + pathname).replace(/\/+/g, '/');
    },
    push: function (name, params, search) {
        if (params === void 0) { params = {}; }
        if (search === void 0) { search = {}; }
        var fullpath = this.GetPathFromName(name, params);
        History.push({ pathname: fullpath, search: stringify(search) });
    },
    replace: function (name, params, search) {
        if (params === void 0) { params = {}; }
        if (search === void 0) { search = {}; }
        var fullpath = this.GetPathFromName(name, params);
        History.replace({ pathname: fullpath, search: stringify(search) });
    },
    pushCall: function (name, params, search) {
        var _this = this;
        if (params === void 0) { params = {}; }
        if (search === void 0) { search = {}; }
        return function () { return _this.push(name, params, search); };
    },
    replaceCall: function (name, params, search) {
        var _this = this;
        if (params === void 0) { params = {}; }
        if (search === void 0) { search = {}; }
        return function () { return _this.replace(name, params, search); };
    }
};
exports.default = ReactRouterNav;
