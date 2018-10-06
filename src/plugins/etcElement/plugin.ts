import { ipcMain } from 'electron';
import { plugin } from '../../interfaces';
import board from './node/communication/etc_eos_element';
import oscPort from './node/communication/oscPort';
let oscCfg:oscCfg = require("./config.json");
import { oscCfg } from './typings/osc';
import fs = require("fs");

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
ipcMain.on("/settings/mounted",(event:any) => {
    event.sender.send("/settings/add",etcElement.includes.ui!);
});
ipcMain.on("/settings/etcElement/query",(event:any) => {
    event.sender.send("/settings/etcElement/update",oscCfg);
});
ipcMain.on("/settings/etcElement/update",(event:any,oscCfg:oscCfg) => {
    console.log(__dirname + "/config.json",oscCfg);
    etcElement.includes.node!.board = board(oscPort(oscCfg));
    fs.writeFile(__dirname+"/config.json",JSON.stringify(oscCfg),(err: Error) => {
        console.log(err);
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