let mainWindow:BrowserWindow;
export function init(mw:BrowserWindow) {
    mainWindow = mw;
}

// +---------------------+
// |   Create messager   |
// +---------------------+
import Emitter = require("events");
class Messager extends Emitter {
    send(channel:string,...msg:any) {
        this.emit(channel,...msg);
        mainWindow.webContents.send(channel,...msg);
    }
};
let messager:ipcEmitter = new Messager();

// +--------------------+
// |   Import plugins   |
// +--------------------+
import etcElement from "./etcElement/plugin"; // Communication controller
etcElement(messager);
import fx from "./fx/plugin"; // Effect controller
fx(messager);

// +------------------------------------------+
// |   Imports for helping plugins interact   |
// +------------------------------------------+
import {ipcMain, BrowserWindow} from 'electron';
import { ipcEmitter } from './typings/plugin';

// +------------------+
// |   Setup Events   |
// +------------------+
let oldEmit = ipcMain.emit;
ipcMain.emit = function(channel:string,event:any,...msgs:any) {
    messager.emit.apply(messager,[channel].concat(msgs));
    return oldEmit.apply(this,[channel,event].concat(msgs));
}
