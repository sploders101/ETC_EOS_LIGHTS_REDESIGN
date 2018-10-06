export interface oscCfg {
    port: {
        localAddress: string;
        localPort: number;
        remoteAddress: string;
        remotePort: number;
    },
    faders: number;
}

export interface oscMsg {
    address: string;
    args?: any;
}