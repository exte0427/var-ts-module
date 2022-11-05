import { Type } from "./types";
import { Virtual } from "./virtual";
export declare namespace Handdle {
    const add: (parentEl: HTMLElement | Document, index: number, key: number) => void;
    const insert: (parentEl: HTMLElement | Document, index: number, key: number, lastDom: HTMLElement | Text | undefined) => void;
    const change: (parentEl: HTMLElement, target: HTMLElement, data: Virtual.DomState, key: number) => void;
    const changeState: (el: HTMLElement | Text, lastStates: Type.Object, nowStates: Type.Object) => void;
    const del: (data: HTMLElement | Text) => void;
}
export declare namespace Compare {
    let lastData: Array<Virtual.DomState>;
    let nowData: Array<Virtual.DomState>;
    const render: (startPoint: number) => void;
}
