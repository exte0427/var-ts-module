import { Virtual } from "./virtual";
import { Type } from "./types";
export declare namespace App {
    class Location {
        key: number;
        loc: number;
        constructor(key_: number, loc_: number);
    }
    class VarClass {
        keys: Array<Location>;
        value: Virtual.Dom;
        realDom: HTMLElement | Text;
        constructor(value_: Virtual.Dom);
    }
    let vars: Array<VarClass>;
    const render: (startPoint: number) => void;
    let mainDom: HTMLElement;
    const set: (startDom: Type.Class, states: Type.Object) => void;
}
