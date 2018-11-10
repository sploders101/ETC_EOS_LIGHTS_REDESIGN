// +---------------------------------------------------------------------+
// |                                                                     |
// |          ETC Element Board API (to be used as a reference)          |
// |                                                                     |
// +---------------------------------------------------------------------+

// +-------------+
// |   Imports   |
// +-------------+
import board from './node/communication/etc_eos_element';
import oscPort from './node/communication/oscPort';
import { oscCfg as oscCfgT } from './typings/osc';
import fs = require("fs");
let defaultCfg: oscCfgT = {
    "faders": 500,
    "port": {
        "localAddress": "0.0.0.0",
        "localPort": 57121,
        "remoteAddress": "0.0.0.0",
        "remotePort": 57122
    }
}

// +-----------------------+
// |   Plugin Definition   |
// +-----------------------+
import { boardAPI } from '../typings/board';
import { Messager } from '../loader';

// +--------------------------------------------------------------+
// |   Register handlers so other plugins can use our functions   |
// +--------------------------------------------------------------+
export default function init(msg:Messager) {
    let etcElement:boardAPI;
    msg.once("/config/get/etcElement",(oscCfg:oscCfgT) => {
        etcElement = board(oscPort(oscCfg, msg));
        msg.on("/board/command", function (cmd: string, ...args: any[]) {
            etcElement[cmd].apply(etcElement, args);
        });
    });
    msg.send("/config/get","etcElement", defaultCfg);
    
    // +--------------------------+
    // |   Inject UI components   |
    // +--------------------------+
    msg.on("/settings/mounted",() => {
        msg.send("/settings/add", `${__dirname}/ui/settings`);
    });
    msg.on("/home/mounted",() => {
        msg.send("/home/add", `${__dirname}/ui/home`);
    });
    
    // +--------------------------------------------------+
    // |   Events for interaction between plugin and UI   |
    // +--------------------------------------------------+
    msg.on("/etcElement/getConfig",() => {
        msg.emit("/config/get","etcElement",defaultCfg);
    })
    msg.on("/settings/etcElement/update/save",(oscCfg:oscCfgT) => {
        msg.emit("/config/set","etcElement",oscCfg);
        etcElement.extras.close();
        etcElement = board(oscPort(oscCfg,msg));
        msg.send("/settings/etcElement/update",oscCfg);
    });
}
