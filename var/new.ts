import { Virtual } from "./virtual";
import { Type } from "./types";
import { MainClass } from "./mainClass";

export namespace New {
    export const el = (tag: string | Type.Class, state: Type.Object, ...children: Array<Virtual.Dom | string | Array<Virtual.Dom | string>>) => {
        const myChild: Array<Virtual.Dom | string> = (Array.isArray(children[0]) ? children[0] : children) as Array<Virtual.Dom | string>;

        if (state === null)
            state = {};
        if (typeof tag === 'string')
            return new Virtual.Dom(tag, state, staticRenderer(myChild));
        else
            return new Virtual.Dom(tag.name, state, new tag());
    }
    export const tx = (data: string) => {
        return new Virtual.Dom(`text`, { "value": data }, staticRenderer([]));
    }

    export const staticRenderer = (children: Array<Virtual.Dom | string>) => {
        const myClass = new MainClass.Dom();
        myClass._children_ = children;
        return myClass;
    }
}