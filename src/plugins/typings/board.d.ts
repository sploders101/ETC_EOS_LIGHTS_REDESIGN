export interface board {
    (modules: any): boardAPI;
}

export interface boardAPI {
    ping(text:string, timeout:number): Promise<Boolean>;
    initPing(text:string, timeout:number): Promise<Boolean>;
    sendSub(sub: number, val:number): void;
    mixSub(command: "enable" | "disable" | "remove" | "set", identifier: string, submaster?: number, val?: number): void;
    updateSubMix(submaster: number): void;
    updateLayerMix(layer: string): void;
    sendFader(fader: number,val: number): void;
    getFaders(numFaders: number, cb: getFadersCallback): void;
    setSubName(sub: number, name: string): void;
    setParam(channel: number, param: string, value: number): void;
    extras: any;
}

// Related interfaces

interface getFadersCallback {
    (fader: fader): void;
}

export interface fader {
    id: number;
    value: number;
}
