import { MainClass } from "./mainClass";
import { Type } from "./types";

export namespace Virtual {
    export class Dom {
        tag: string;
        myClass: MainClass.Dom = null;

        constructor(tag_: string, states_: Type.Object, myClass_: MainClass.Dom) {
            this.tag = tag_;
            this.myClass = myClass_;
            this.myClass.states = states_;
        }
    }
}