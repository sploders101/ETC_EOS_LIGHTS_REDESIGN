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
// console.log(oscCfgS);
let oscCfg:oscCfgT = JSON.parse(oscCfgS);
console.log(oscCfg);

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

// +--------------------------------------------------+
// |   Events for interaction between plugin and UI   |
// +--------------------------------------------------+
ipcMain.on("/settings/mounted",(event:any) => {
    event.sender.send("/settings/add",etcElement.includes.ui!);
});
ipcMain.on("/settings/etcElement/query",(event:any) => {
    console.log(oscCfg);
    event.sender.send("/settings/etcElement/update",oscCfg);
});
ipcMain.on("/settings/etcElement/update",(event:any,oscCfgL:oscCfgT) => {
    oscCfg = oscCfgL
    // console.log(__dirname + "/config.json", JSON.stringify(oscCfg));
    etcElement.includes.node!.board = board(oscPort(oscCfg));
    fs.writeFile(__dirname + "/config.json", JSON.stringify(oscCfg),(err: Error) => {
        // console.log(err);
        event.sender.send("/settings/etcElement/update/saved");
        if(err) {
            event.sender.send("/settings/etcElement/update/error", err);
            console.error(err)
        };
    })
});

export {
    etcElement
};