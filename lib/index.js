"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectNavModel = void 0;
var History;
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
            Routes[item.name] = item.path;
        }
    });
}
function InjectNavModel(history, routes) {
    if (routes === void 0) { routes = []; }
    History = history;
    InjectNavRoutes(routes);
}
exports.InjectNavModel = InjectNavModel;
var ReactRouterNav = {
    // 获取pathname
    GetPathFromName: function (name, params) {
        if (params === void 0) { params = {}; }
        var path = Routes[name];
        if (path) {
            return path.replace(/\/:(\w+)/g, function (_, k) {
                if (params.hasOwnProperty(k)) {
                    return '/' + params[k];
                }
                else {
                    console.error("\u8DEF\u7531" + path + "\u7F3A\u5C11\u53C2\u6570:" + k);
                    return '/';
                }
            });
        }
        else {
            console.error("\u6CA1\u6709\u627E\u5230" + name + "\u8DEF\u7531");
            return '/';
        }
    },
    // 获取完整路径
    GetHrefFromName: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var name = _a[0], _b = _a[1], params = _b === void 0 ? {} : _b, _c = _a[2], search = _c === void 0 ? {} : _c;
        var fullpath = this.GetPathFromName(name, params);
        var pathname = History.createHref({ pathname: fullpath, search: stringify(search) });
        return window.location.origin + ('/' + pathname).replace(/\/+/g, '/');
    },
    push: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var name = _a[0], _b = _a[1], params = _b === void 0 ? {} : _b, _c = _a[2], search = _c === void 0 ? {} : _c;
        var fullpath = this.GetPathFromName(name, params);
        History.push({ pathname: fullpath, search: stringify(search) });
    },
    replace: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var name = _a[0], _b = _a[1], params = _b === void 0 ? {} : _b, _c = _a[2], search = _c === void 0 ? {} : _c;
        var fullpath = this.GetPathFromName(name, params);
        History.replace({ pathname: fullpath, search: stringify(search) });
    },
    pushCall: function () {
        var _this = this;
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var name = _a[0], _b = _a[1], params = _b === void 0 ? {} : _b, _c = _a[2], search = _c === void 0 ? {} : _c;
        return function () { return _this.push(name, params, search); };
    },
    replaceCall: function () {
        var _this = this;
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var name = _a[0], _b = _a[1], params = _b === void 0 ? {} : _b, _c = _a[2], search = _c === void 0 ? {} : _c;
        return function () { return _this.replace(name, params, search); };
    }
};
exports.default = ReactRouterNav;
