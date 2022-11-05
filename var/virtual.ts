import { App } from "./app";
import { MainClass } from "./mainClass";
import { Type } from "./types";

export namespace Virtual {
    export class Dom {
        tag: string;
        myClass: MainClass.Dom;

        constructor(tag_: string, states_: Type.Object, myClass_: MainClass.Dom) {
            this.tag = tag_;
            this.myClass = myClass_;
            this.myClass.states = states_;
        }
    }

    export class DomState{
        tag: string;
        states: Object;
        keys: Array<App.Location>;
        realDom:HTMLElement | Text;

        constructor(tag_:string,states_:Object,keys_:Array<App.Location>,realDom_:HTMLElement | Text){
            this.tag=tag_;
            this.states=states_;
            this.keys=keys_;
            this.realDom=realDom_;
        }
    }
}