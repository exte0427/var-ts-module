"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compare = exports.Handdle = void 0;
var app_1 = require("./app");
var Handdle;
(function (Handdle) {
    var get_cssChange = function (lastStyle, nowStyle, dom) {
        //add & change
        for (var name_1 in nowStyle) {
            var value = nowStyle[name_1];
            // new & change
            if (lastStyle[name_1] === undefined || lastStyle[name_1] !== value)
                dom.style[name_1] = value;
        }
    };
    var make = function (data, key) {
        if (data.value.tag === "text") {
            //const myDom = document.createElement(`var-text`);
            var myDom = document.createTextNode(data.value.myClass.states["value"]);
            //myDom.appendChild(element);
            return myDom;
        }
        else {
            var myDom = document.createElement(data.value.tag);
            var states = data.value.myClass.states;
            for (var name_2 in states) {
                var data_1 = states[name_2];
                if (typeof data_1 === "string")
                    myDom.setAttribute(name_2, data_1);
                else if (name_2 === "style")
                    get_cssChange(myDom.style, data_1, myDom);
                else if (name_2.length > 2 && name_2.split("").splice(0, 2).join("") === "on")
                    myDom[name_2] = app_1.App.vars[key].value.myClass.states[name_2];
            }
            return myDom;
        }
    };
    Handdle.add = function (parentEl, data, key) {
        var realDom = make(data, key);
        data.realDom = realDom;
        parentEl.appendChild(realDom);
    };
    Handdle.insert = function (parentEl, data, key, lastDom) {
        if (lastDom === undefined)
            Handdle.add(parentEl, data, key);
        else {
            var realDom = make(data, key);
            data.realDom = realDom;
            parentEl.insertBefore(realDom, lastDom);
        }
    };
    Handdle.change = function (parentEl, target, data, key) {
        var realDom = make(data, key);
        data.realDom = realDom;
        parentEl.replaceChild(realDom, target);
    };
    Handdle.changeState = function (el, lastStates, nowStates) {
        //add & change
        for (var name_3 in nowStates) {
            var value = nowStates[name_3];
            if (typeof value === "string") {
                // new & change
                if ((lastStates[name_3] === undefined || lastStates[name_3] !== value) && name_3 !== "value")
                    el.setAttribute(name_3, value);
            }
            if (name_3 === "style")
                get_cssChange(lastStates[name_3], nowStates[name_3], el);
            // text change
            if (name_3 === "value" && lastStates[name_3] !== value)
                el.nodeValue = value;
        }
        // del
        for (var name_4 in lastStates) {
            var value = lastStates[name_4];
            if (typeof value === "string") {
                // new & change
                if (nowStates[name_4] === undefined)
                    el.removeAttribute(name_4);
            }
        }
    };
    Handdle.del = function (data) {
        data.remove();
    };
})(Handdle = exports.Handdle || (exports.Handdle = {}));
var Change;
(function (Change) {
    Change.lastElements = function (last, now) {
        var calcMax = function (a, b) { return a > b ? a : b; };
        var table = Array.from(Array(last.length), function () { return new Array(now.length); });
        if (last.length === 0)
            return last;
        if (now.length === 0)
            return now;
        now.map(function (valy, y) {
            last.map(function (valx, x) {
                var nowVal = 0;
                if (x > 0 || y > 0) {
                    if (x > 0 && y > 0)
                        nowVal = calcMax(table[x - 1][y], table[x][y - 1]);
                    else if (x > 0)
                        nowVal = table[x - 1][y];
                    else
                        nowVal = table[x][y - 1];
                    if (last[x] === now[y])
                        nowVal++;
                }
                table[x][y] = nowVal;
            });
        });
        var lasts = [];
        var max = table[last.length - 1][now.length - 1];
        var y = last.length - 1;
        var x = now.length - 1;
        while (max) {
            if (table[x - 1][y] === table[x][y - 1]) {
                x -= 1;
                y -= 1;
                max--;
                lasts.push(now[y]);
            }
            else if (table[x - 1][y] === table[x][y])
                x -= 1;
            else if (table[x][y - 1] === table[x][y])
                y -= 1;
        }
        return lasts;
    };
    var AddSet = /** @class */ (function () {
        function AddSet(data_, lastDom_) {
            this.data = data_;
            this.lastDom = lastDom_;
        }
        return AddSet;
    }());
    Change.AddSet = AddSet;
    Change.findDiff = function (nowData, ntChange) {
        var nowIndex = 0;
        var returnData = [];
        if (ntChange.length === 0) {
            return nowData.map(function (e) { return (new AddSet(e, undefined)); });
        }
        nowData.map(function (element) {
            if (element.key === ntChange[nowIndex].key) {
                returnData.push(new AddSet(element, app_1.App.vars[ntChange[nowIndex].loc].realDom));
                nowIndex++;
            }
        });
        return returnData;
    };
})(Change || (Change = {}));
var Compare;
(function (Compare) {
    // eslint-disable-next-line prefer-const
    Compare.lastData = [];
    // eslint-disable-next-line prefer-const
    Compare.nowData = [];
    var delChildKey = function (lastData, startPoint) {
        if (lastData[startPoint] !== undefined)
            lastData[startPoint].keys.map(function (e) {
                if (lastData[e.loc] !== undefined)
                    delChildKey(lastData, e.loc);
            });
        lastData[startPoint] = undefined;
    };
    Compare.render = function (startPoint) {
        // dynamic
        if (app_1.App.vars[startPoint].keys.length === 0 || app_1.App.vars[startPoint].keys[0].key !== -1) {
            // text
            if (app_1.App.vars[startPoint].value.tag === "text")
                return;
            // not first time
            if (Compare.lastData[startPoint] !== undefined) {
                var ntChange = Change.lastElements(Compare.lastData[startPoint].keys, Compare.nowData[startPoint].keys);
                var add = Change.findDiff(Compare.nowData[startPoint].keys, ntChange);
                var del = Change.findDiff(Compare.lastData[startPoint].keys, ntChange);
                // change states
                for (var _i = 0, ntChange_1 = ntChange; _i < ntChange_1.length; _i++) {
                    var e = ntChange_1[_i];
                    var lastState = Compare.lastData[e.loc].value.myClass.states;
                    var nowState = Compare.nowData[e.loc].value.myClass.states;
                    Handdle.changeState(app_1.App.vars[e.loc].realDom, lastState, nowState);
                }
                // del
                for (var _a = 0, del_1 = del; _a < del_1.length; _a++) {
                    var e = del_1[_a];
                    Handdle.del(Compare.lastData[e.data.loc].realDom);
                }
                // add
                for (var _b = 0, add_1 = add; _b < add_1.length; _b++) {
                    var e = add_1[_b];
                    Handdle.insert(app_1.App.vars[startPoint].realDom, app_1.App.vars[e.data.loc], e.data.loc, e.lastDom);
                    delChildKey(Compare.lastData, e.data.loc);
                }
            }
            // first time
            else {
                Compare.nowData[startPoint].keys.map(function (e) {
                    Handdle.add(app_1.App.vars[startPoint].realDom, app_1.App.vars[e.loc], e.loc);
                    delChildKey(Compare.lastData, e.loc);
                });
            }
        }
        // static
        else {
            for (var _c = 0, _d = Compare.nowData[startPoint].keys; _c < _d.length; _c++) {
                var e = _d[_c];
                var lastS = Compare.lastData[e.loc];
                var nowS = app_1.App.vars[e.loc];
                if (nowS === undefined && lastS === undefined)
                    throw new Error("Error!");
                if (lastS === undefined)
                    Handdle.add(app_1.App.vars[startPoint].realDom, nowS, e.loc);
                else if (nowS === undefined)
                    Handdle.del(lastS.realDom);
                else if (lastS.value.tag !== nowS.value.tag) {
                    Handdle.change(app_1.App.vars[startPoint].realDom, lastS.realDom, nowS, e.loc);
                    delChildKey(Compare.lastData, e.loc);
                }
                else
                    Handdle.changeState(app_1.App.vars[e.loc].realDom, lastS.value.myClass.states, nowS.value.myClass.states);
            }
        }
        // repeat
        app_1.App.vars[startPoint].keys.map(function (index) { return Compare.render(index.loc); });
    };
})(Compare = exports.Compare || (exports.Compare = {}));
