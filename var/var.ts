// Web
import { New } from "./new";
import { MainClass } from "./mainClass";
import { WebPage } from "./webPage";

export namespace Var {
    export namespace Path {
        export const start = WebPage.start;
        export const set = WebPage.set;
    }

    export const Dom = MainClass.Dom;
    export const Component = MainClass.Component;

    export const Create = New;
}