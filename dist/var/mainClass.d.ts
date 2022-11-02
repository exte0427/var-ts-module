import { Virtual } from "./virtual";
import { Type } from "./types";
export declare namespace MainClass {
    class Dom {
        tag: string;
        states: Type.Object;
        onChange: () => void;
        onRender: () => Virtual.Dom | string;
        onStart: () => void;
        use: <T extends Type.Class>(Cl: T) => InstanceType<T>;
        _components_: Array<Component>;
        _children_: Array<Virtual.Dom | string>;
    }
    class Component {
        onStart: () => void;
    }
}
