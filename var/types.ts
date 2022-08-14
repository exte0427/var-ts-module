/* eslint-disable @typescript-eslint/no-explicit-any */
export namespace Type {
    export type Object = { [x: string]: any };
    export type Class = { new(...args: any[]): any; };
}