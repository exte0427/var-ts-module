"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Detect = exports.Change = void 0;
var htmlHandle_1 = require("./htmlHandle");
var app_1 = require("./app");
var webPage_1 = require("./webPage");
var Change;
(function (Change) {
    Change.deepCopy = function (obj) {
        if (obj === null || typeof obj !== "object")
            return obj;
        var copy = Array.isArray(obj) ? [] : {};
        for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
            var key = _a[_i];
            if (key !== "realDom")
                copy[key] = Change.deepCopy(obj[key]);
            else
                copy[key] = obj[key];
        }
        return copy;
    };
    Change.changes = {};
    Change.changer = function (key) {
        //del last
        if (Change.changes[key] !== undefined)
            window.cancelAnimationFrame(Change.changes[key]);
        //delay
        Change.changes[key] = window.requestAnimationFrame(function () {
            Change.realChanger(key);
            Change.changes[key] = undefined;
        });
    };
    Change.realChanger = function (key) {
        // render
        app_1.App.render(key);
        htmlHandle_1.Compare.nowData = Change.deepCopy(app_1.App.vars);
        // appear
        htmlHandle_1.Compare.render(key);
        htmlHandle_1.Compare.lastData = Change.deepCopy(app_1.App.vars);
    };
})(Change = exports.Change || (exports.Change = {}));
var Detect;
(function (Detect) {
    Detect.isObject = function (var1) {
        return ((typeof var1 === "object") && var1 !== null);
    };
    Detect.start = function (obj, key) {
        Detect.child(obj, key);
    };
    var proxy = function (obj, key) {
        if (Detect.isObject(obj)) {
            for (var el in obj) {
                if (Detect.isObject(obj[el])) {
                    obj[el] = proxy(obj[el], key);
                }
            }
        }
        var nowNum = webPage_1.WebPage.changNum;
        var value = new Proxy(obj, {
            get: function (target, key) {
                return target[key];
            },
            set: function (target, myKey, value) {
                if (webPage_1.WebPage.changNum === nowNum) {
                    if (myKey !== "states" && myKey !== "_children_" && myKey !== "_components_") {
                        if (Detect.isObject(value))
                            target[myKey] = proxy(value, key);
                        else
                            target[myKey] = value;
                        Change.changer(key);
                    }
                    else
                        target[key] = value;
                    return true;
                }
                else
                    throw new Error("page was reloaded, but you're using not-used variable");
            }
        });
        return value;
    };
    Detect.child = function (obj, key, setChild) {
        if (setChild === void 0) { setChild = false; }
        Object.defineProperty(obj, "__var_values__", {
            value: {},
            writable: true
        });
        var nowNum = webPage_1.WebPage.changNum;
        var _loop_1 = function (name_1) {
            if (name_1 !== "states" && name_1 !== "_children_") {
                if (Detect.isObject(obj[name_1])) {
                    if (name_1 === "_components_" || setChild === true) {
                        obj["__var_values__"][name_1] = obj[name_1];
                        Detect.child(obj["__var_values__"][name_1], key, true);
                        return "continue";
                    }
                    else
                        obj["__var_values__"][name_1] = proxy(obj[name_1], key);
                }
                else
                    obj["__var_values__"][name_1] = obj[name_1];
                Object.defineProperty(obj, name_1, {
                    get: function () {
                        return obj["__var_values__"][name_1];
                    },
                    set: function (newValue) {
                        if (webPage_1.WebPage.changNum === nowNum) {
                            if (Detect.isObject(newValue))
                                obj["__var_values__"][name_1] = proxy(newValue, key);
                            else
                                obj["__var_values__"][name_1] = newValue;
                            Change.changer(key);
                        }
                        else
                            throw new Error("page was reloaded, but you're using not-used variable");
                    }
                });
            }
        };
        for (var name_1 in obj) {
            _loop_1(name_1);
        }
    };
})(Detect = exports.Detect || (exports.Detect = {}));
/*export namespace Detect {

    export class DetectVar {
        key: number;
        value: Type.Object;

        constructor(key_: number, value_: Type.Object) {
            this.key = key_;
            this.value = value_;
        }
    }

    export const start = (myVar: Type.Object, key: number) => {
        if (myVar[`vars`] !== undefined && Object.keys(myVar[`vars`]).length !== 0)
            myVar[`vars`] = detectChild(new DetectVar(key, myVar[`vars`])).value;
    }

    export const detectChild = (myVar: DetectVar) => {
        if (typeof myVar.value === `object`) {
            for (const el in myVar.value) {
                if (el !== `states` && el !== `children` && typeof myVar.value[el] === `object`) {
                    myVar.value[el] = detectChild(new DetectVar(myVar.key, myVar.value[el])).value;
                }
            }
        }

        const value = new Proxy(myVar.value, {
            get(target, key) {
                return target[key as string];
            },
            set(target, key, value) {
                if (key !== `states` && key !== `children`) {
                    if (typeof value === `object`)
                        target[key as string] = detectChild(new DetectVar(myVar.key, value)).value;
                    else
                        target[key as string] = value;
                    Change.changer(myVar.key);
                }
                else
                    target[key] = value;
                return true;
            }
        });
        const key = myVar.key;

        return new DetectVar(key, value);
    }
}*/ 
