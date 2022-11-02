import { App } from './app'
import { Type } from './types';
import { Virtual } from './virtual'
export namespace WebPage {

    export let changNum = 0;
    type PathSetting = { [x: string]: Type.Class };
    let setting: PathSetting = {};

    export const start = (setting_: PathSetting) => {
        setting = setting_;

        window.onload = () => {
            console.clear();
            console.log("VAR.TS");

            const states: Type.Object = {};
            const params = new URLSearchParams(window.location.search);
            const search = window.location.search;
            const hash = window.location.hash;

            params.forEach((value, key) => {
                states[key] = value;
            });

            set(window.location.pathname, states, search, hash);
        }
    }

    const set = (path: string, states: Type.Object, search: string, hash: string) => {

        window.history.pushState({}, ``, `${path}${search}${hash}`);
        changNum++;

        if (setting[path] === undefined)
            throw new Error(`page ${path} is not existing`);
        else {
            const myDom = setting[path];
            const myStates = { ...states, hash: hash.substring(1) };

            App.set(myDom, myStates);
        }
    }
}