import { Virtual } from "./virtual";
import { Type } from "./types";
import { WebPage } from "./webPage";

export namespace MainClass {
    export class Dom {
        tag: string;
        states: Type.Object = {};

        onChange: () => void;
        onRender: () => Virtual.Dom | string;
        onStart: () => void;

        // internal functions & variables
        // user use
        use = <T extends Type.Class>(Cl: T) => {
            const myComponent: InstanceType<T> = new Cl();
            this._components_.push(myComponent);

            return this._components_[this._components_.length - 1] as InstanceType<T>;
        }

        // internal use
        _components_: Array<Component> = [];
        _children_: Array<Virtual.Dom | string> = [];
    }

    export class Component {
        onStart: () => void;
    }
}