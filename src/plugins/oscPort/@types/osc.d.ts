declare module 'osc' {
    import { EventEmitter } from "events";

    namespace osc {
        export interface oscMsg {
            address: string;
            args?: any;
        }
    
        class UDPPort extends EventEmitter {
            constructor(config:oscCfg);
            open(): void;
            send(msg: oscMsg, remoteAddress?: string, remotePort?: number): void;
            close(): void;
        }

        interface oscCfg {
            localAddress: string;
            localPort: number;
            metadata?: boolean;
            remotePort?: number;
            remoteAddress?: string;
            broadcast?: boolean;
            multicastTTL?: number;
            multicastMembership?: string[];
            socketId?: number;
        }
    }
    export = osc;
}

declare module 'oscPlugin' {
    export interface oscDest {
        remotePort: number;
        remoteAddress: string;
    }
}