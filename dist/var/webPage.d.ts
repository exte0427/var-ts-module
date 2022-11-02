import { Type } from './types';
export declare namespace WebPage {
    export let changNum: number;
    type PathSetting = {
        [x: string]: Type.Class;
    };
    export const start: (setting_: PathSetting) => void;
    export {};
}
