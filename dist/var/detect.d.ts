import { Type } from "./types";
export declare namespace Change {
    const deepCopy: (obj: Type.Object) => Type.Object;
    const changes: Object;
    const changer: (key: number) => void;
    const realChanger: (key: number) => void;
}
export declare namespace Detect {
    const isObject: (var1: any) => boolean;
    const start: (obj: Type.Object, key: number) => void;
    const child: (obj: Type.Object, key: number, setChild?: boolean) => void;
}
