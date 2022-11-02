"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainClass = void 0;
var MainClass;
(function (MainClass) {
    var Dom = /** @class */ (function () {
        function Dom() {
            var _this = this;
            this.tag = "";
            this.states = {};
            this.onChange = function () { };
            this.onRender = function () { return "null"; };
            this.onStart = function () { };
            // internal functions & variables
            // user use
            this.use = function (Cl) {
                var myComponent = new Cl();
                _this._components_.push(myComponent);
                return _this._components_[_this._components_.length - 1];
            };
            // internal use
            this._components_ = [];
            this._children_ = [];
        }
        return Dom;
    }());
    MainClass.Dom = Dom;
    var Component = /** @class */ (function () {
        function Component() {
            this.onStart = function () { };
        }
        return Component;
    }());
    MainClass.Component = Component;
})(MainClass = exports.MainClass || (exports.MainClass = {}));
