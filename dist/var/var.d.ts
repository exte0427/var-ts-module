import { New } from "./new";
import { MainClass } from "./mainClass";
import * as css from 'csstype';
export declare namespace Var {
    const path: (setting_: {
        [x: string]: import("./types").Type.Class;
    }) => void;
    const Dom: typeof MainClass.Dom;
    const Component: typeof MainClass.Component;
    const Create: typeof New;
    type Css = css.Properties;
}
