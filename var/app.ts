import { Virtual } from "./virtual";
import { Change, Detect } from "./detect";
import { Handdle, Compare } from "./htmlHandle";
import { New } from "./new";
import { Type } from "./types";

export namespace App {

    export class Location {
        key: number;
        loc: number;

        constructor(key_: number, loc_: number) {
            this.key = key_;
            this.loc = loc_;
        }
    }

    export class VarClass {
        keys: Array<Location> = [];
        value: Virtual.Dom;
        realDom: HTMLElement | Text = undefined as unknown as HTMLElement;

        constructor(value_: Virtual.Dom) {
            this.value = value_;
        }
    }

    export let vars: Array<VarClass> = [];
    let renewVar: Array<number> = [];

    export let isFirst = false;
    export let delTimes:Array<number> = [];
    export let delInters:Array<number> = [];

    const editVar = (dom: Virtual.Dom) => {
        let loc = vars.length;
        if (renewVar.length !== 0)
            loc = renewVar.pop() as number;

        // set
        vars[loc] = new VarClass(dom);

        // detect , onStart
        if (vars[loc].value.myClass.onStart !== undefined)
            vars[loc].value.myClass.onStart();

        vars[loc].value.myClass._components_.map(e => {
            if (e.onStart !== undefined)
                e.onStart();
        });
        Detect.start(vars[loc].value.myClass, loc);

        //vars[loc].value.myClass = Detect.detectChild(new Detect.DetectVar(loc, vars[loc].value.myClass)).value;

        return loc;
    }

    export const render = (startPoint: number) => {
        const target = vars[startPoint];
        let newKids: Array<Virtual.Dom | string> = [];
        if (target.value.myClass.onRender() === "null")
            newKids = target.value.myClass._children_;
        else
            newKids = [target.value.myClass.onRender()];

        // text to text dom
        const kids = newKids.map(e => {
            if (e instanceof Virtual.Dom)
                return e;
            else
                return New.tx(e);
        });

        if (kids.length > 0) {
            // dynamic
            if (kids[0].myClass.states.key !== undefined) {

                const lastKeys = [...target.keys];
                target.keys = kids.map(e => {
                    if (e.myClass.states.key === undefined)
                        throw new Error(`don't put changeable doms and static doms in same parent`);

                    const key: number = e.myClass.states.key;
                    const last = lastKeys.find(e => e.key === key);
                    if (last === undefined)
                        return new Location(key, editVar(e));
                    else {
                        vars[last.loc].value.myClass.states = e.myClass.states;
                        return new Location(key, last.loc);
                    }
                });
            }
            // static
            else {
                // first time
                if (target.keys.length === 0) {
                    const newKeys: Array<Location> = [];
                    kids.map(e => {
                        newKeys.push(new Location(-1, editVar(e)));

                        if (e.myClass.states.key !== undefined)
                            throw new Error(`don't put changeable doms and static doms in same parent`);
                    });

                    // key apply
                    target.keys = newKeys;
                }
                // or
                else {
                    // replace states & children
                    kids.map((e, i) => {
                        vars[target.keys[i].loc].value.myClass.states = e.myClass.states;
                        vars[target.keys[i].loc].value.myClass._children_ = e.myClass._children_;

                        if (e.myClass.states.key !== undefined)
                            throw new Error(`don't put changeable doms and static doms in same parent`);
                    });

                    // check error
                    if (target.keys.length !== kids.length)
                        throw new Error(`changeable doms need key state`);
                }
            }

            // repeat
            target.keys.map(e => { render(e.loc); });
        }
        else
            target.keys = [];
    }

    export let mainDom: HTMLElement;
    export const set = (startDom: Type.Class, states: Type.Object) => {

        // clear trash
        delTimes.map(e => {
            clearTimeout(e);
        });

        delInters.map(e => {
            clearInterval(e);
        });

        // first setting
        const body = new VarClass(new Virtual.Dom(`body`, {}, New.staticRenderer([New.app(startDom, states)])));
        body.realDom = document.querySelector(`body`) as HTMLElement;
        vars = [body];
        renewVar = [];

        // render & change
        Change.changer(0);
    }
}