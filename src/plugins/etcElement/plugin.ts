// +---------------------------------------------------------------------+
// |                                                                     |
// |          ETC Element Board API (to be used as a reference)          |
// |                                                                     |
// +---------------------------------------------------------------------+

// +-------------+
// |   Imports   |
// +-------------+
import { ipcMain } from 'electron';
import board from './node/communication/etc_eos_element';
import oscPort from './node/communication/oscPort';
import { oscCfg as oscCfgT } from './typings/osc';
import fs = require("fs");
let oscCfgS = fs.readFileSync(__dirname + "/config.json", 'utf-8');
let oscCfg:oscCfgT = JSON.parse(oscCfgS);

import { EventEmitter } from 'events';
let msg:EventEmitter;

// +-----------------------+
// |   Plugin Definition   |
// +-----------------------+
import { plugin } from '../../interfaces';
let etcElement: plugin = {
    enabled: true,
    includes: {
        ui: {
            settings: `${__dirname}/ui/settings/oscPort`
        },
        node: {
            board: board(oscPort(oscCfg)),
        }
    }
}
export {etcElement as board,init};

// +--------------------------------------------------------------+
// |   Register handlers so other plugins can use our functions   |
// +--------------------------------------------------------------+
function init(messager:EventEmitter) {
    msg = messager;
    msg.on("/board/command", function (cmd: string, ...args: any[]) {
        // console.log(cmd)
        etcElement.includes.node!.board![cmd].apply(null,args);
    });
}

// +--------------------------------------------------+
// |   Events for interaction between plugin and UI   |
// +--------------------------------------------------+
ipcMain.on("/settings/mounted",(event:any) => {
    event.sender.send("/settings/add",etcElement.includes.ui!);
});
ipcMain.on("/settings/etcElement/query",(event:any) => {
    event.sender.send("/settings/etcElement/update",oscCfg);
});
ipcMain.on("/settings/etcElement/update",(event:any,oscCfgL:oscCfgT) => {
    oscCfg = oscCfgL
    fs.writeFile(__dirname + "/config.json", JSON.stringify(oscCfg),(err: Error) => {
        event.sender.send("/settings/etcElement/update/saved");
        if(err) {
            event.sender.send("/settings/etcElement/update/error", err);
            console.error(err)
        };
    });
    etcElement.includes.node!.board!.extras.close();
    etcElement.includes.node!.board = board(oscPort(oscCfg));
    event.sender.send("/settings/etcElement/update",oscCfg);
});
