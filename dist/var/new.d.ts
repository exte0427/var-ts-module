import { Virtual } from "./virtual";
import { Type } from "./types";
import { MainClass } from "./mainClass";
export declare namespace New {
    const el: (tag: string | Type.Class, state: Type.Object, ...children: Array<Virtual.Dom | string | Array<Virtual.Dom | string>>) => Virtual.Dom;
    const app: (tag: Type.Class, state: Type.Object) => Virtual.Dom;
    const tx: (data: string) => Virtual.Dom;
    const staticRenderer: (children: Array<Virtual.Dom | string>) => MainClass.Dom;
}
