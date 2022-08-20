// Web
import { New } from "./new";
import { MainClass } from "./mainClass";
import { WebPage } from "./webPage";
import * as css from 'csstype';

export namespace Var {
    export namespace Path {
        export const start = WebPage.start;
        export const set = WebPage.set;
    }

    export const Dom = MainClass.Dom;
    export const Component = MainClass.Component;

    export const Create = New;
    export type Css = css.Properties;
}