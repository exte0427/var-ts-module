"use strict";
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
exports.WebPage = void 0;
var app_1 = require("./app");
var WebPage;
(function (WebPage) {
    WebPage.changNum = 0;
    var setting = {};
    WebPage.start = function (setting_) {
        setting = setting_;
        window.onload = function () {
            console.clear();
            console.log("VAR.TS");
            var states = {};
            var params = new URLSearchParams(window.location.search);
            var search = window.location.search;
            var hash = window.location.hash;
            params.forEach(function (value, key) {
                states[key] = value;
            });
            set(window.location.pathname, states, search, hash);
        };
    };
    var set = function (path, states, search, hash) {
        window.history.pushState({}, "", "" + path + search + hash);
        WebPage.changNum++;
        if (setting[path] === undefined)
            throw new Error("page " + path + " is not existing");
        else {
            var myDom = setting[path];
            var myStates = __assign(__assign({}, states), { hash: hash.substring(1) });
            app_1.App.set(myDom, myStates);
        }
    };
})(WebPage = exports.WebPage || (exports.WebPage = {}));
