import { App } from "./app";
import { MainClass } from "./mainClass";
import { Type } from "./types";
export declare namespace Virtual {
    class Dom {
        tag: string;
        myClass: MainClass.Dom;
        constructor(tag_: string, states_: Type.Object, myClass_: MainClass.Dom);
    }
    class DomState {
        tag: string;
        states: Object;
        keys: Array<App.Location>;
        realDom: HTMLElement | Text;
        constructor(tag_: string, states_: Object, keys_: Array<App.Location>, realDom_: HTMLElement | Text);
    }
}
