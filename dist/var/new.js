"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.New = void 0;
var virtual_1 = require("./virtual");
var mainClass_1 = require("./mainClass");
var New;
(function (New) {
    New.el = function (tag, state) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        var myChild = [];
        children.map(function (e) {
            if (Array.isArray(e))
                myChild = __spreadArray(__spreadArray([], myChild, true), e, true);
            else if (e !== undefined)
                myChild = __spreadArray(__spreadArray([], myChild, true), [e], false);
        });
        if (state === null)
            state = {};
        if (typeof tag === 'string')
            return new virtual_1.Virtual.Dom(tag, state, New.staticRenderer(myChild));
        else
            return new virtual_1.Virtual.Dom(tag.name, state, new tag());
    };
    New.app = function (tag, state) {
        return new virtual_1.Virtual.Dom("App", state, new tag());
    };
    New.tx = function (data) {
        return new virtual_1.Virtual.Dom("text", { "value": data }, New.staticRenderer([]));
    };
    New.staticRenderer = function (children) {
        var myClass = new mainClass_1.MainClass.Dom();
        myClass._children_ = children;
        return myClass;
    };
})(New = exports.New || (exports.New = {}));
