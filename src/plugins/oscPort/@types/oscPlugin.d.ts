declare module 'oscPlugin' {
    export interface oscDest {
        remotePort: number;
        remoteAddress: string;
    }
    export interface oscMsg {
        address: string;
        args?: any;
    }
}