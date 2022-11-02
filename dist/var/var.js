"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Var = void 0;
// Web
var new_1 = require("./new");
var mainClass_1 = require("./mainClass");
var webPage_1 = require("./webPage");
var Var;
(function (Var) {
    Var.path = webPage_1.WebPage.start;
    Var.Dom = mainClass_1.MainClass.Dom;
    Var.Component = mainClass_1.MainClass.Component;
    Var.Create = new_1.New;
})(Var = exports.Var || (exports.Var = {}));
