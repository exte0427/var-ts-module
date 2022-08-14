import { App } from './app'
import { Type } from './types';
import { Virtual } from './virtual'
export namespace WebPage {

    type PathSetting = { [x: string]: Virtual.Dom };
    let setting: PathSetting = {};

    export const start = (setting_: PathSetting) => {
        setting = setting_;

        window.onload = () => {
            const states: Type.Object = {};
            const params = new URLSearchParams(window.location.search);

            params.forEach((value, key) => {
                states[key] = value;
            });

            set(window.location.pathname, states);
        }
    }

    export const set = (path: string, states: Type.Object) => {
        window.history.pushState({}, ``, path);

        const myDom = setting[path];
        myDom.myClass.states = states;
        App.set(setting[path]);
    }
}