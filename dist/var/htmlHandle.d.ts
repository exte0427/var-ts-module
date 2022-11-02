import { App } from "./app";
import { Type } from "./types";
export declare namespace Handdle {
    const add: (parentEl: HTMLElement | Document, data: App.VarClass, key: number) => void;
    const insert: (parentEl: HTMLElement | Document, data: App.VarClass, key: number, lastDom: HTMLElement | Text | undefined) => void;
    const change: (parentEl: HTMLElement, target: HTMLElement, data: App.VarClass, key: number) => void;
    const changeState: (el: HTMLElement | Text, lastStates: Type.Object, nowStates: Type.Object) => void;
    const del: (data: HTMLElement | Text) => void;
}
export declare namespace Compare {
    let lastData: Array<App.VarClass>;
    let nowData: Array<App.VarClass>;
    const render: (startPoint: number) => void;
}
