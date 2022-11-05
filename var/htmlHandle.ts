import { App } from "./app";
import { Type } from "./types";
import { Properties } from 'csstype';
import { unwatchFile } from "fs";
import { Virtual } from "./virtual";

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

    const make = (data: Virtual.DomState, key: number): HTMLElement | Text => {
        if (data.tag === `text`) {
            //const myDom = document.createElement(`var-text`);
            const myDom = document.createTextNode(data.states[`value`]);
            //myDom.appendChild(element);

            return myDom;
        }
        else {
            const myDom: HTMLElement = document.createElement(data.tag);
            const states = data.states;

            for (const name in states) {
                const data = states[name];

                if (typeof data === `string`)
                    myDom.setAttribute(name, data);

                else if (name === `style`)
                    get_cssChange(myDom.style as Properties, data as Properties, myDom);

                else if (name.length > 2 && name.split(``).splice(0, 2).join(``) === `on`)
                    myDom[name] = Compare.nowData[key].states[name];

            }

            return myDom;
        }
    }

    export const add = (parentEl: HTMLElement | Document, index:number, key: number) => {
        const realDom = make(Compare.nowData[index], key);
        Compare.nowData[index].realDom = realDom;
        App.vars[index].realDom = realDom;
        parentEl.appendChild(realDom);
    }

    export const insert = (parentEl: HTMLElement | Document, index:number, key: number, lastDom: HTMLElement | Text | undefined) => {
        if (lastDom === undefined)
            add(parentEl, index, key);

        else {
            const realDom = make(Compare.nowData[index], key);
            Compare.nowData[index].realDom = realDom;
            App.vars[index].realDom = realDom;
            parentEl.insertBefore(realDom, lastDom);
        }
    }

    export const change = (parentEl: HTMLElement, target: HTMLElement, data: Virtual.DomState, key: number) => {
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
                returnData.push(new AddSet(element,Compare.nowData[ntChange[nowIndex].loc].realDom));
                nowIndex++;
            }
        });

        return returnData;
    }
}

export namespace Compare {
    // eslint-disable-next-line prefer-const
    export let lastData: Array<Virtual.DomState> = [];

    // eslint-disable-next-line prefer-const
    export let nowData: Array<Virtual.DomState> = [];

    const delChildKey = (lastData: Array<Virtual.DomState>, startPoint: number) => {
        if (lastData[startPoint] !== undefined)
            lastData[startPoint].keys.map(e => {

                if (lastData[e.loc] !== undefined)
                    delChildKey(lastData, e.loc);
            });
        lastData[startPoint] = undefined as unknown as Virtual.DomState;
    }

    export const render = (startPoint: number) => {
        // dynamic
        if (nowData[startPoint].keys.length === 0 || nowData[startPoint].keys[0].key !== -1) {
            // text
            if (nowData[startPoint].tag === `text`)
                return;

            // not first time
            if (lastData[startPoint] !== undefined) {
                const ntChange = Change.lastElements(lastData[startPoint].keys, nowData[startPoint].keys);
                const add = Change.findDiff(nowData[startPoint].keys, ntChange);
                const del = Change.findDiff(lastData[startPoint].keys, ntChange);

                // change states
                for (const e of ntChange) {
                    const lastState = lastData[e.loc].states;
                    const nowState = nowData[e.loc].states;

                    Handdle.changeState(nowData[e.loc].realDom as HTMLElement, lastState, nowState);
                }

                // del
                for (const e of del)
                    Handdle.del(lastData[e.data.loc].realDom);

                // add
                for (const e of add) {
                    Handdle.insert(nowData[startPoint].realDom as HTMLElement, e.data.loc, e.data.loc, e.lastDom);
                    delChildKey(lastData, e.data.loc);
                }
            }
            // first time
            else {
                nowData[startPoint].keys.map(e => {
                    Handdle.add(nowData[startPoint].realDom as HTMLElement, e.loc, e.loc);
                })
            }
        }

        // static
        else {
            for (const e of nowData[startPoint].keys) {
                if (nowData[e.loc] === undefined && lastData[e.loc] === undefined)
                    throw new Error(`Error!`);
                if (lastData[e.loc] === undefined)
                    Handdle.add(nowData[startPoint].realDom as HTMLElement, e.loc, e.loc);
                else if (nowData[e.loc] === undefined)
                    Handdle.del(lastData[e.loc].realDom);
                else if (lastData[e.loc].tag !== nowData[e.loc].tag) {
                    Handdle.change(nowData[startPoint].realDom as HTMLElement, lastData[e.loc].realDom as HTMLElement, nowData[e.loc], e.loc);
                    delChildKey(lastData, e.loc);
                }
                else 
                    Handdle.changeState(nowData[e.loc].realDom as HTMLElement, lastData[e.loc].states, nowData[e.loc].states);
            }
        }

        // repeat
        nowData[startPoint].keys.map(index => render(index.loc));
    }
}