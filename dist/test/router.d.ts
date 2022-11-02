import { Var } from "./../var/var";
export declare class App extends Var.Dom {
    arr: {
        el: string;
        key: number;
    }[];
    nowKey: number;
    addOne: () => void;
    delOne: () => void;
    reverse: () => void;
    onRender: () => any;
}
