// +---------------------+
// |   Create messager   |
// +---------------------+
import Emitter = require("events");
import {ipcMain, BrowserWindow} from 'electron';
export class Messager extends Emitter {
    mainWindow:BrowserWindow;
    constructor(mw:BrowserWindow) {
        super();
        this.setMaxListeners(999);
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
import configManager from "./configManager"; // Configuration manager
import oscPort from "./oscPort";
import etcElement from "./etcElement"; // Communication controller
import mixer from "./mixer"; // Mixer plugin to prevent strobing from conflicting fx
import fx from "./fx"; // Effect controller
import fxE from "./fxEngine"; // Effect engine (timing)
import fxUI from "./fxUI"; // Effect UI
import oldFX from "./oldFX"; // Old FX from previous lighting software

export function init(mw:BrowserWindow) {
    let msg = new Messager(mw);
    configManager(msg);
    oscPort(msg);
    etcElement(msg);
    mixer(msg);
    fx(msg);
    fxE(msg);
    fxUI(msg);
    oldFX(msg);
}
