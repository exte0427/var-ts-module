import { Compare } from "./htmlHandle";
import { App } from "./app";
import { Type } from "./types";

export namespace Change {

    export const deepCopy = (obj: Type.Object) => {
        if (obj === null || typeof obj !== `object`)
            return obj;

        const copy: Type.Object = Array.isArray(obj) ? [] : {};

        for (const key of Object.keys(obj)) {
            if (key !== `realDom`)
                copy[key] = deepCopy(obj[key]);
            else
                copy[key] = obj[key];
        }

        return copy;
    }
    export const changer = (key: number) => {
        App.render(key);
        Compare.nowData = deepCopy(App.vars) as Array<App.VarClass>;
        Compare.render(key);
        Compare.lastData = deepCopy(App.vars) as Array<App.VarClass>;
    }
}

export namespace Detect {

    export const isObject = (var1: any) => {
        return ((typeof var1 === `object`) && var1 !== null);
    }

    export const start = (obj: Type.Object, key: number) => {
        child(obj, key);
    }
    const proxy = (obj: Type.Object, key: number) => {
        if (isObject(obj)) {
            for (const el in obj) {
                if (isObject(obj[el])) {
                    obj[el] = proxy(obj[el], key);
                }
            }
        }

        const value = new Proxy(obj, {
            get(target, key) {
                return target[key as string];
            },
            set(target, myKey, value) {
                if (myKey !== `states` && myKey !== `_children_` && myKey !== `_components_`) {
                    if (isObject(value))
                        target[myKey as string] = proxy(value, key);
                    else
                        target[myKey as string] = value;

                    Change.changer(key);
                }
                else
                    target[key] = value;

                return true;
            }
        });

        return value;
    }
    export const child = (obj: Type.Object, key: number, setChild = false) => {
        Object.defineProperty(obj, `__var_values__`, {
            value: {},
            writable: true
        });

        for (const name in obj) {
            if (name !== `states` && name !== `_children_`) {
                if (isObject(obj[name])) {
                    if (name === `_components_` || setChild === true) {
                        obj[`__var_values__`][name] = obj[name];

                        child(obj[`__var_values__`][name], key, true);
                        continue;
                    }
                    else
                        obj[`__var_values__`][name] = proxy(obj[name], key);
                }
                else
                    obj[`__var_values__`][name] = obj[name];

                Object.defineProperty(obj, name, {
                    get() {
                        return obj[`__var_values__`][name];
                    },
                    set(newValue) {
                        if (isObject(newValue))
                            obj[`__var_values__`][name] = proxy(newValue, key);
                        else
                            obj[`__var_values__`][name] = newValue;

                        Change.changer(key);
                    }
                });
            }
        }
    }
}

/*export namespace Detect {

    export class DetectVar {
        key: number;
        value: Type.Object;

        constructor(key_: number, value_: Type.Object) {
            this.key = key_;
            this.value = value_;
        }
    }

    export const start = (myVar: Type.Object, key: number) => {
        if (myVar[`vars`] !== undefined && Object.keys(myVar[`vars`]).length !== 0)
            myVar[`vars`] = detectChild(new DetectVar(key, myVar[`vars`])).value;
    }

    export const detectChild = (myVar: DetectVar) => {
        if (typeof myVar.value === `object`) {
            for (const el in myVar.value) {
                if (el !== `states` && el !== `children` && typeof myVar.value[el] === `object`) {
                    myVar.value[el] = detectChild(new DetectVar(myVar.key, myVar.value[el])).value;
                }
            }
        }

        const value = new Proxy(myVar.value, {
            get(target, key) {
                return target[key as string];
            },
            set(target, key, value) {
                if (key !== `states` && key !== `children`) {
                    if (typeof value === `object`)
                        target[key as string] = detectChild(new DetectVar(myVar.key, value)).value;
                    else
                        target[key as string] = value;
                    Change.changer(myVar.key);
                }
                else
                    target[key] = value;
                return true;
            }
        });
        const key = myVar.key;

        return new DetectVar(key, value);
    }
}*/