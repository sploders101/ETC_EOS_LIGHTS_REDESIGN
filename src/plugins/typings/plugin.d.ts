import Vue from 'vue';
import { EventEmitter } from 'events';

export interface UICard {
    path: string;
    component: Vue;
}

export class ipcEmitter extends EventEmitter {
    send(channel: string, ...message: any): void;
}