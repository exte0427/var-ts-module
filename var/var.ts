// Web
import { New } from "./new";
import { MainClass } from "./mainClass";
import { WebPage } from "./webPage";
import * as css from 'csstype';

export namespace Var {
    export const path = WebPage.start;

    export const Dom = MainClass.Dom;
    export const Component = MainClass.Component;

    export const Create = New;
    export type Css = css.Properties;
}