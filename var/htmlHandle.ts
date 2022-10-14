import { App } from "./app";
import { Type } from "./types";
import { Properties } from 'csstype';
import { unwatchFile } from "fs";

export namespace Handdle {

    const get_cssChange = (lastStyle: Properties, nowStyle: Properties, dom: HTMLElement) => {
        //add & change
        for (const name in nowStyle) {
            const value = nowStyle[name];

            // new & change
            if (lastStyle[name] === undefined || lastStyle[name] !== value)
                dom.style[name] = value;
        }
    }

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

                else if (name === `style`)
                    get_cssChange(myDom.style as Properties, data as Properties, myDom);

                else if (name.length > 2 && name.split(``).splice(0, 2).join(``) === `on`)
                    myDom[name] = App.vars[key].value.myClass.states[name];

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

            if (name === `style`)
                get_cssChange(lastStates[name], nowStates[name], el as HTMLElement);

            if (name.length > 2 && name.split(``).splice(0, 2).join(``) === `on` && App.isFirst)
                el[name] = nowStates[name];

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
        const calcMax = (a: number, b: number) => a > b ? a : b;
        const table: Array<Array<number>> = Array.from(Array(last.length), () => new Array(now.length));

        if (last.length === 0)
            return last;
        if (now.length === 0)
            return now;

        now.map((valy, y) => {
            last.map((valx, x) => {
                let nowVal = 0;
                if (x > 0 || y > 0) {
                    if (x > 0 && y > 0)
                        nowVal = calcMax(table[x - 1][y], table[x][y - 1]);
                    else if (x > 0)
                        nowVal = table[x - 1][y];
                    else
                        nowVal = table[x][y - 1];

                    if(last[x] === now[y])
                        nowVal++;
                }

                table[x][y] = nowVal;
            });
        });

        const lasts:Array<App.Location> = [];
        let max = table[last.length - 1][now.length - 1];
        let y = last.length - 1;
        let x = now.length - 1;
        while(max){
            if(table[x-1][y] === table[x][y-1]){
                x-=1;
                y-=1;
                max--;

                lasts.push(now[y]);
            }

            else if(table[x-1][y] === table[x][y])
                x-=1;
            else if(table[x][y-1] === table[x][y])
                y-=1;
        }

        return lasts;
    }
    
    export class AddSet {
        data: App.Location;
        lastDom: HTMLElement | Text | undefined;

        constructor(data_: App.Location, lastDom_: HTMLElement | Text|undefined) {
            this.data = data_;
            this.lastDom = lastDom_;
        }
    }

    export const findDiff = (nowData: Array<App.Location>, ntChange: Array<App.Location>) => {
        let nowIndex = 0;
        const returnData:Array<AddSet> = [];

        if(ntChange.length === 0){
            return nowData.map(e=>(
                new AddSet(e,undefined)
            ))
        }

        nowData.map((element)=>{
            if(element.key === ntChange[nowIndex].key){
                returnData.push(new AddSet(element,App.vars[ntChange[nowIndex].loc].realDom));
                nowIndex++;
            }
        });

        return returnData;
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
        lastData[startPoint] = undefined as unknown as App.VarClass;
    }

    export const render = (startPoint: number) => {
        // dynamic
        if (App.vars[startPoint].keys.length === 0 || App.vars[startPoint].keys[0].key !== -1) {
            // text
            if (App.vars[startPoint].value.tag === `text`)
                return;

            // changed spa
            if (App.isFirst) {
                App.vars[startPoint].keys.map(e => {
                    if (lastData[e.loc] !== undefined)
                        App.vars[e.loc].realDom = lastData[e.loc].realDom;
                });
            }

            // not first time
            if (lastData[startPoint] !== undefined) {
                const ntChange = Change.lastElements(lastData[startPoint].keys, nowData[startPoint].keys);
                const add = Change.findDiff(nowData[startPoint].keys, ntChange);
                const del = Change.findDiff(lastData[startPoint].keys, ntChange);

                // change states
                for (const e of ntChange) {
                    const lastState = lastData[e.loc].value.myClass.states;
                    const nowState = nowData[e.loc].value.myClass.states;

                    Handdle.changeState(App.vars[e.loc].realDom as HTMLElement, lastState, nowState);
                }

                // del
                for (const e of del)
                    Handdle.del(lastData[e.data.loc].realDom);

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
                    delChildKey(lastData, e.loc);
                })
            }
        }

        // static
        else {
            for (const e of nowData[startPoint].keys) {
                const lastS = lastData[e.loc];
                const nowS = App.vars[e.loc];

                if (nowS === undefined && lastS === undefined)
                    throw new Error(`Error!`);
                if (lastS === undefined)
                    Handdle.add(App.vars[startPoint].realDom as HTMLElement, nowS, e.loc);
                else if (nowS === undefined)
                    Handdle.del(lastS.realDom);
                else if (lastS.value.tag !== nowS.value.tag) {
                    Handdle.change(App.vars[startPoint].realDom as HTMLElement, lastS.realDom as HTMLElement, nowS, e.loc);
                    delChildKey(lastData, e.loc);
                }
                else {
                    if (App.isFirst)
                        nowS.realDom = lastS.realDom;
                    Handdle.changeState(App.vars[e.loc].realDom as HTMLElement, lastS.value.myClass.states, nowS.value.myClass.states);
                }
            }
        }

        // repeat
        App.vars[startPoint].keys.map(index => render(index.loc));
    }
}