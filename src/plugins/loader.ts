// +---------------------+
// |   Create messager   |
// +---------------------+
import Emitter = require("events");
class Messager extends Emitter {};
let messager = new Messager();

// +--------------------+
// |   Import plugins   |
// +--------------------+
import {init as etcElement, board} from "./etcElement/plugin"; // Communication controller
etcElement(messager);

// +------------------------------------------+
// |   Imports for helping plugins interact   |
// +------------------------------------------+
import {ipcMain} from 'electron';

// +------------------+
// |   Setup Events   |
// +------------------+
// Allow renderer to run communication commands
ipcMain.on("/board/command",function(_:any,command:string,...args:any[]) {
    messager.emit.apply(messager,["/board/command",command].concat(args));
    console.log(["/board/command", command].concat(args));
    // messager.emit("/board/command","sendSub",1,1);
});
