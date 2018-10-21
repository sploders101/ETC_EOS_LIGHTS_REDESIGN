let mainWindow:BrowserWindow;
export function init(mw:BrowserWindow) {
    mainWindow = mw;
}

// +---------------------+
// |   Create messager   |
// +---------------------+
import Emitter = require("events");
class Messager extends Emitter {
    send(channel:string,msg:any) {
        this.emit(channel,msg);
        mainWindow.webContents.send(channel,msg);
    }
};
let messager:ipcEmitter = new Messager();

// +--------------------+
// |   Import plugins   |
// +--------------------+
import etcElement from "./etcElement/plugin"; // Communication controller
etcElement(messager);

// +------------------------------------------+
// |   Imports for helping plugins interact   |
// +------------------------------------------+
import {ipcMain, BrowserWindow} from 'electron';
import { ipcEmitter } from './typings/plugin';

// +------------------+
// |   Setup Events   |
// +------------------+
let oldEmit = ipcMain.emit;
ipcMain.emit = function(channel:string,...msgs:any) {
    
    messager.emit.apply(messager,[channel].concat(msgs));
    return oldEmit.apply(this,[channel].concat(msgs));
}

// Allow renderer to run communication commands
ipcMain.on("/board/command",function(_:any,command:string,...args:any[]) {
    messager.emit.apply(messager,["/board/command",command].concat(args));
    console.log(["/board/command", command].concat(args));
    // messager.emit("/board/command","sendSub",1,1);
});
