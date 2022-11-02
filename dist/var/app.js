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
exports.App = void 0;
var virtual_1 = require("./virtual");
var detect_1 = require("./detect");
var new_1 = require("./new");
var App;
(function (App) {
    var Location = /** @class */ (function () {
        function Location(key_, loc_) {
            this.key = key_;
            this.loc = loc_;
        }
        return Location;
    }());
    App.Location = Location;
    var VarClass = /** @class */ (function () {
        function VarClass(value_) {
            this.keys = [];
            this.realDom = undefined;
            this.value = value_;
        }
        return VarClass;
    }());
    App.VarClass = VarClass;
    App.vars = [];
    var renewVar = [];
    var editVar = function (dom) {
        var loc = App.vars.length;
        if (renewVar.length !== 0)
            loc = renewVar.pop();
        // set
        App.vars[loc] = new VarClass(dom);
        // detect , onStart
        if (App.vars[loc].value.myClass.onStart !== undefined)
            App.vars[loc].value.myClass.onStart();
        App.vars[loc].value.myClass._components_.map(function (e) {
            if (e.onStart !== undefined)
                e.onStart();
        });
        detect_1.Detect.start(App.vars[loc].value.myClass, loc);
        //vars[loc].value.myClass = Detect.detectChild(new Detect.DetectVar(loc, vars[loc].value.myClass)).value;
        return loc;
    };
    App.render = function (startPoint) {
        var target = App.vars[startPoint];
        var newKids = [];
        if (target.value.myClass.onRender() === "null")
            newKids = target.value.myClass._children_;
        else
            newKids = [target.value.myClass.onRender()];
        // text to text dom
        var kids = newKids.map(function (e) {
            if (e instanceof virtual_1.Virtual.Dom)
                return e;
            else
                return new_1.New.tx(e);
        });
        if (kids.length > 0) {
            // dynamic
            if (kids[0].myClass.states.key !== undefined) {
                var lastKeys_1 = __spreadArray([], target.keys, true);
                target.keys = kids.map(function (e) {
                    if (e.myClass.states.key === undefined)
                        throw new Error("don't put changeable doms and static doms in same parent");
                    var key = e.myClass.states.key;
                    var last = lastKeys_1.find(function (e) { return e.key === key; });
                    if (last === undefined)
                        return new Location(key, editVar(e));
                    else {
                        App.vars[last.loc].value.myClass.states = e.myClass.states;
                        return new Location(key, last.loc);
                    }
                });
            }
            // static
            else {
                // first time
                if (target.keys.length === 0) {
                    var newKeys_1 = [];
                    kids.map(function (e) {
                        newKeys_1.push(new Location(-1, editVar(e)));
                        if (e.myClass.states.key !== undefined)
                            throw new Error("don't put changeable doms and static doms in same parent");
                    });
                    // key apply
                    target.keys = newKeys_1;
                }
                // or
                else {
                    // replace states & children
                    kids.map(function (e, i) {
                        App.vars[target.keys[i].loc].value.myClass.states = e.myClass.states;
                        App.vars[target.keys[i].loc].value.myClass._children_ = e.myClass._children_;
                        if (e.myClass.states.key !== undefined)
                            throw new Error("don't put changeable doms and static doms in same parent");
                    });
                    // check error
                    if (target.keys.length !== kids.length)
                        throw new Error("changeable doms need key state");
                }
            }
            // repeat
            target.keys.map(function (e) { App.render(e.loc); });
        }
        else
            target.keys = [];
    };
    App.set = function (startDom, states) {
        // first setting
        var body = new VarClass(new virtual_1.Virtual.Dom("body", {}, new_1.New.staticRenderer([new_1.New.app(startDom, states)])));
        body.realDom = document.querySelector("body");
        App.vars = [body];
        renewVar = [];
        // render & change
        detect_1.Change.changer(0);
    };
})(App = exports.App || (exports.App = {}));
