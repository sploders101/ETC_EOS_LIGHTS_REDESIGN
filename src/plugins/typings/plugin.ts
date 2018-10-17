import {boardAPI} from './board';
import Vue from 'vue';

export interface plugin {
    enabled: boolean;
    includes: {
        ui?: {
            settings?: string // Vue cards for settings window
        },
        node?: {
            board?: boardAPI // Middleware to use for communication
        }
    }
}

export interface UICard {
    path: string;
    component: Vue;
}