"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Virtual = void 0;
var Virtual;
(function (Virtual) {
    var Dom = /** @class */ (function () {
        function Dom(tag_, states_, myClass_) {
            this.tag = tag_;
            this.myClass = myClass_;
            this.myClass.states = states_;
        }
        return Dom;
    }());
    Virtual.Dom = Dom;
    var DomState = /** @class */ (function () {
        function DomState(tag_, states_, keys_, realDom_) {
            this.tag = tag_;
            this.states = states_;
            this.keys = keys_;
            this.realDom = realDom_;
        }
        return DomState;
    }());
    Virtual.DomState = DomState;
})(Virtual = exports.Virtual || (exports.Virtual = {}));
