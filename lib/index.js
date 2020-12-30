"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReactRouterNav = /** @class */ (function () {
    function ReactRouterNav(history, routes) {
        this.Routes = {};
        this.History = history;
        this.inject(routes);
    }
    // 对象转换为序列字符串
    ReactRouterNav.prototype.stringify = function (search) {
        if (search === void 0) { search = {}; }
        var params = "";
        if (typeof search === "string") {
            params = search;
        }
        else {
            params = Object.keys(search).map(function (k) { return k + "=" + search[k]; }).join("&");
        }
        return params;
    };
    ReactRouterNav.prototype.inject = function (routes) {
        var _this = this;
        routes.map(function (item) {
            if (_this.Routes.hasOwnProperty(item.name)) {
                console.error("route-name(" + item.name + ")\u6709\u91CD\u590D\uFF0C\u8BF7\u91CD\u547D\u540D");
            }
            else {
                _this.Routes[item.name] = item.path;
            }
        });
    };
    // 获取pathname
    ReactRouterNav.prototype.GetPathFromName = function (name, params) {
        if (params === void 0) { params = {}; }
        var path = this.Routes[name];
        if (path) {
            return path.replace(/\/:(\w+)/g, function (_, k) {
                if (params.hasOwnProperty(k)) {
                    return '/' + params[k];
                }
                else {
                    console.error("\u8DEF\u7531" + name + "\u7F3A\u5C11\u53C2\u6570:" + k);
                    return '';
                }
            });
        }
        else {
            console.error("\u6CA1\u6709\u627E\u5230" + name + "\u8DEF\u7531");
        }
    };
    // 获取完整路径
    ReactRouterNav.prototype.GetHrefFromName = function (name, params, search) {
        if (params === void 0) { params = {}; }
        if (search === void 0) { search = {}; }
        var fullpath = this.GetPathFromName(name, params);
        if (fullpath) {
            var pathname = this.History.createHref({ pathname: fullpath, search: this.stringify(search) });
            return window.location.origin + ('/' + pathname).replace('//', '');
        }
    };
    ReactRouterNav.prototype.push = function (name, params, search) {
        if (params === void 0) { params = {}; }
        if (search === void 0) { search = {}; }
        var fullpath = this.GetPathFromName(name, params);
        if (fullpath) {
            this.History.push({ pathname: fullpath, search: this.stringify(search) });
        }
    };
    ReactRouterNav.prototype.replace = function (name, params, search) {
        if (params === void 0) { params = {}; }
        if (search === void 0) { search = {}; }
        var fullpath = this.GetPathFromName(name, params);
        if (fullpath) {
            this.History.replace({ pathname: fullpath, search: this.stringify(search) });
        }
    };
    ReactRouterNav.prototype.pushCall = function (name, params, search) {
        var _this = this;
        if (params === void 0) { params = {}; }
        if (search === void 0) { search = {}; }
        return function () { return _this.push(name, params, search); };
    };
    ReactRouterNav.prototype.replaceCall = function (name, params, search) {
        var _this = this;
        if (params === void 0) { params = {}; }
        if (search === void 0) { search = {}; }
        return function () { return _this.replace(name, params, search); };
    };
    return ReactRouterNav;
}());
exports.default = ReactRouterNav;
