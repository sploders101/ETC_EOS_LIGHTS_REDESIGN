declare module 'osc-min' {

    export type timetag = UNIXTime | NTPTimeTag | Date;
    /**
     * Seconds since 1970 UTC
     */
    export type UNIXTime = number;
    /**
     * NTP Timetag
     */
    export type NTPTimeTag = [number,number];
    /**
     * Milliseconds from current time
     */
    export type msDelay = number;

    export interface oscMsg {
        oscType?: string;
        address: string;
        args?: oscArg[];
    }

    export interface oscBundle {
        oscType: "bundle";
        timetag: null | msDelay | Date | NTPTimeTag
    }

    export interface oscArg {
        type: "string"
            | "float"
            | "integer"
            | "blob"
            | "true"
            | "false"
            | "null"
            | "bang"
            | "timetag"
            | "array";
        value: string | number | Buffer | boolean | null | UNIXTime | oscArg[];
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
    
    export function fromBuffer(inBuf:Buffer,strict?:boolean): oscMsg;
    
    export function toBuffer(msg:oscMsg,strict?:boolean): Buffer;
    export function toBuffer(address:string,args:any[],strict?:boolean): Buffer;

    export function applyAddressTransform(inBuf:Buffer,newAddr:string): Buffer;
    export function applyMessageTransform(inBuf:Buffer,newAddr:(msg:oscMsg) => oscMsg): Buffer;

    export function timetagToDate(ntpTimeTag:NTPTimeTag): Date;
    export function dateToTimetag(time:Date): NTPTimeTag;

    export function timeTagToTimestamp(timetag:NTPTimeTag): UNIXTime
    export function timestampToTimetag(timeMS:UNIXTime): NTPTimeTag;
}