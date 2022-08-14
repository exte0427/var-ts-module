import { App } from "./app";
import { Type } from "./types";

export namespace Handdle {
    const make = (data: App.VarClass, key: number): HTMLElement | Text => {
        if (data.value.tag === `text`) {
            //const myDom = document.createElement(`var-text`);
            const myDom = document.createTextNode(data.value.myClass.states[`value`]);
            //myDom.appendChild(element);

            return myDom;
        }
        else {
            const myDom: HTMLElement = document.createElement(data.value.tag);
            const states = data.value.myClass.states;

            for (const name in states) {
                const data = states[name];

                if (typeof data === `string`)
                    myDom.setAttribute(name, data);

                if (name.length > 2 && name.split(``).splice(0, 2).join(``) === `on`)
                    myDom.addEventListener(name.split(``).splice(2).join(``), App.vars[key].value.myClass.states[name]);

            }

            return myDom;
        }
    }

    export const add = (parentEl: HTMLElement | Document, data: App.VarClass, key: number) => {
        const realDom = make(data, key);
        data.realDom = realDom;
        parentEl.appendChild(realDom);
    }

    export const insert = (parentEl: HTMLElement | Document, data: App.VarClass, key: number, lastDom: HTMLElement | Text | undefined) => {
        if (lastDom === undefined)
            add(parentEl, data, key);

        else {
            const realDom = make(data, key);
            data.realDom = realDom;
            parentEl.insertBefore(realDom, lastDom);
        }
    }

    export const change = (parentEl: HTMLElement, target: HTMLElement, data: App.VarClass, key: number) => {
        const realDom = make(data, key);
        data.realDom = realDom;
        parentEl.replaceChild(realDom, target);
    }

    export const changeState = (el: HTMLElement | Text, lastStates: Type.Object, nowStates: Type.Object) => {
        //add & change
        for (const name in nowStates) {
            const value = nowStates[name];

            if (typeof value === `string`) {
                // new & change
                if ((lastStates[name] === undefined || lastStates[name] !== value) && name !== `value`)
                    (el as HTMLElement).setAttribute(name, value);
            }

            // text change
            if (name === `value` && lastStates[name] !== value)
                el.nodeValue = value;
        }

        // del
        for (const name in lastStates) {
            const value = lastStates[name];

            if (typeof value === `string`) {
                // new & change
                if (nowStates[name] === undefined)
                    (el as HTMLElement).removeAttribute(name);
            }
        }
    }

    export const del = (data: HTMLElement | Text) => {
        data.remove();
    }
}

namespace Change {
    export const lastElements = (last: Array<App.Location>, now: Array<App.Location>) => {
        const calcMax = (a: Array<App.Location>, b: Array<App.Location>) => a.length > b.length ? a : b;
        const table: Array<Array<Array<App.Location>>> = Array.from(Array(last.length), () => new Array(now.length));

        const doTableX: Array<boolean> = [];
        const doTableY: Array<boolean> = [];

        if (last.length === 0)
            return last;
        if (now.length === 0)
            return now;

        now.map((valy, y) => {
            last.map((valx, x) => {
                let nowVal: Array<App.Location> = [];
                if (x > 0 || y > 0) {
                    if (x > 0 && y > 0)
                        nowVal = [...calcMax(table[x - 1][y], table[x][y - 1])];
                    else if (x > 0)
                        nowVal = [...table[x - 1][y]];
                    else
                        nowVal = [...table[x][y - 1]];
                }
                if (valx.key === valy.key && doTableY[y] === undefined && doTableX[x] === undefined) {
                    nowVal = [...nowVal, new App.Location(valy.key, valy.loc)];
                    doTableX[x] = true;
                    doTableY[y] = true;
                }

                table[x][y] = nowVal;
            });
        });

        return table[last.length - 1][now.length - 1];
    }

    export const getDel = (data: Array<App.Location>, compareData: Array<App.Location>) => {
        const returnData: Array<App.Location> = [];

        data.map(e => {
            if (compareData.find(e1 => e1.key === e.key) === undefined)
                returnData.push(e);
        });

        return returnData;
    }

    class AddSet {
        data: App.Location;
        lastDom: HTMLElement | Text | undefined;

        constructor(data_: App.Location, lastDom_: HTMLElement | Text) {
            this.data = data_;
            this.lastDom = lastDom_;
        }
    }

    export const getAdd = (nowData: Array<App.Location>, ntChange: Array<App.Location>) => {
        let pushList: Array<App.Location> = [];
        const returnArr: Array<AddSet> = [];

        for (const i in nowData) {
            let found = false;
            for (const j in ntChange) {
                if (ntChange[j].key === nowData[i].key) {
                    found = true;
                    break;
                }
            }

            if (!found)
                pushList.push(nowData[i]);
            else {
                pushList.map(e => {
                    returnArr.push(new AddSet(e, App.vars[nowData[i].loc].realDom));
                });
                pushList = [];
            }
        }

        pushList.map(e => {
            returnArr.push(new AddSet(e, undefined));
        });

        return returnArr;
    }
}

export namespace Compare {
    // eslint-disable-next-line prefer-const
    export let lastData: Array<App.VarClass> = [];

    // eslint-disable-next-line prefer-const
    export let nowData: Array<App.VarClass> = [];

    const delChildKey = (lastData: Array<App.VarClass>, startPoint: number) => {
        if (lastData[startPoint] !== undefined)
            lastData[startPoint].keys.map(e => {

                if (lastData[e.loc] !== undefined)
                    delChildKey(lastData, e.loc);
            });
        lastData[startPoint] = undefined;
    }

    export const render = (startPoint: number) => {
        // dynamic
        if (App.vars[startPoint].keys.length === 0 || App.vars[startPoint].keys[0].key !== -1) {
            // not first time
            if (lastData[startPoint] !== undefined) {
                const ntChange = Change.lastElements(lastData[startPoint].keys, nowData[startPoint].keys);
                const add = Change.getAdd(nowData[startPoint].keys, ntChange);
                const del = Change.getDel(lastData[startPoint].keys, ntChange);

                // change states
                for (const e of ntChange) {
                    const lastState = lastData[e.loc].value.myClass.states;
                    const nowState = nowData[e.loc].value.myClass.states;

                    Handdle.changeState(App.vars[e.loc].realDom as HTMLElement, lastState, nowState);
                }

                // del
                for (const e of del)
                    Handdle.del(App.vars[e.loc].realDom);

                // add
                for (const e of add) {
                    Handdle.insert(App.vars[startPoint].realDom as HTMLElement, App.vars[e.data.loc], e.data.loc, e.lastDom);
                    delChildKey(lastData, e.data.loc);
                }
            }
            // first time
            else {
                nowData[startPoint].keys.map(e => {
                    Handdle.add(App.vars[startPoint].realDom as HTMLElement, App.vars[e.loc], e.loc);
                })
            }
        }

        // static
        else {
            for (const e of App.vars[startPoint].keys) {
                const lastS = lastData[e.loc];
                const nowS = App.vars[e.loc];

                if (lastS === undefined)
                    Handdle.add(App.vars[startPoint].realDom as HTMLElement, App.vars[e.loc], e.loc);
                else if (nowS === undefined)
                    Handdle.del(lastS.realDom);
                else if (lastS.value.tag !== nowS.value.tag) {
                    Handdle.change(App.vars[startPoint].realDom as HTMLElement, lastS.realDom as HTMLElement, nowS, e.loc);
                    delChildKey(lastData, e.loc);
                }
                else
                    Handdle.changeState(App.vars[e.loc].realDom as HTMLElement, lastS.value.myClass.states, nowS.value.myClass.states);
            }
        }

        // repeat
        App.vars[startPoint].keys.map(index => render(index.loc));
    }
}