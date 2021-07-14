"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = {
    stringify: stringify
};
