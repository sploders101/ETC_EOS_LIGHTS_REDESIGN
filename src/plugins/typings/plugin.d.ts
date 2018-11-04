import Vue from 'vue';
import { EventEmitter } from 'events';

export interface UICard {
    path: string;
    component: Vue;
}
