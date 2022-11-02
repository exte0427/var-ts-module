"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var var_1 = require("./../var/var");
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.arr = [
            {
                el: "hi",
                key: 1
            },
            {
                el: "bye",
                key: 3
            },
            {
                el: "j",
                key: 7
            },
        ];
        _this.nowKey = 8;
        _this.addOne = function () {
            var name = prompt("name");
            _this.arr.push({
                el: name,
                key: _this.nowKey++
            });
        };
        _this.delOne = function () {
            var index = Number(prompt("index"));
            _this.arr.splice(index, 1);
        };
        _this.reverse = function () {
            _this.arr.reverse();
        };
        _this.onRender = function () { return (var_1.Var.Create.el("div", null,
            "hello",
            var_1.Var.Create.el("div", null, _this.arr.map(function (e) { return (var_1.Var.Create.el("div", { key: e.key }, e.el)); })),
            var_1.Var.Create.el("button", { onclick: _this.addOne }, "add one"),
            var_1.Var.Create.el("button", { onclick: _this.delOne }, "del one"),
            var_1.Var.Create.el("button", { onclick: _this.reverse }, "reverse"))); };
        return _this;
    }
    return App;
}(var_1.Var.Dom));
exports.App = App;
var_1.Var.path({
    "/": App
});
