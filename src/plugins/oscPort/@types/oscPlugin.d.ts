declare module 'oscPlugin' {
    export interface oscDest {
        remotePort: number;
        remoteAddress: string;
    }
    export interface oscMsg {
        address: string;
        args?: any;
    }
    export interface oscCfg {
        localAddress: string;
        localPort: number;
        // metadata?: boolean;
        // remotePort?: number;
        // remoteAddress?: string;
        // broadcast?: boolean;
        // multicastTTL?: number;
        // multicastMembership?: string[];
        // socketId?: number;
    }
}