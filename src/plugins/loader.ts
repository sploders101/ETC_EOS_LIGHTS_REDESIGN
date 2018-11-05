// +---------------------+
// |   Create messager   |
// +---------------------+
import Emitter = require("events");
import {ipcMain, BrowserWindow} from 'electron';
export class Messager extends Emitter {
    mainWindow:BrowserWindow;
    constructor(mw:BrowserWindow) {
        super();
        this.mainWindow = mw;
        let oldEmit = ipcMain.emit;
        // Override ipcMain's emit function to bridge it to the global messager
        ipcMain.emit = (channel: string, event: any, ...msgs: any) => {
            this.emit.apply(this, [channel].concat(msgs));
            return oldEmit.apply(ipcMain, [channel, event].concat(msgs));
        }
    }
    send(channel:string,...msg:any) {
        this.emit(channel,...msg);
        this.mainWindow.webContents.send(channel,...msg);
    }
};

// +--------------------+
// |   Import plugins   |
// +--------------------+
import etcElement from "./etcElement/plugin"; // Communication controller
import fx from "./fx/plugin"; // Effect controller
import fxE from "./fxEngine/plugin"; // Effect engine (timing)
import fxUI from "./fxUI/plugin"; // Effect UI
import oldFX from "./oldFX/plugin"; // Old FX from previous lighting software

export function init(mw:BrowserWindow) {
    let messager = new Messager(mw);
    etcElement(messager);
    fx(messager);
    fxE(messager);
    fxUI(messager);
    oldFX(messager);
}
