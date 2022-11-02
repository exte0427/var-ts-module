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
})(Virtual = exports.Virtual || (exports.Virtual = {}));
