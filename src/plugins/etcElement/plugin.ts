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
let oscCfgS = fs.readFileSync(__dirname + "/config.json", 'utf-8');
let oscCfg:oscCfgT = JSON.parse(oscCfgS);

// +-----------------------+
// |   Plugin Definition   |
// +-----------------------+
import { boardAPI } from '../typings/board';
import { Messager } from '../loader';

// +--------------------------------------------------------------+
// |   Register handlers so other plugins can use our functions   |
// +--------------------------------------------------------------+
export default function init(msg:Messager) {
    let etcElement:boardAPI = board(oscPort(oscCfg,msg));
    msg.on("/board/command", function (cmd: string, ...args: any[]) {
        etcElement[cmd].apply(etcElement,args);
    });
    
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
    msg.on("/settings/etcElement/query",() => {
        msg.send("/settings/etcElement/update",oscCfg);
    });
    msg.on("/settings/etcElement/update/save",(oscCfgL:oscCfgT) => {
        oscCfg = oscCfgL
        fs.writeFile(__dirname + "/config.json", JSON.stringify(oscCfg, null, 4),(err: Error) => {
            msg.send("/settings/etcElement/update/saved");
            if(err) {
                msg.send("/settings/etcElement/update/error", err);
                console.error(err)
            };
        });
        etcElement.extras.close();
        etcElement = board(oscPort(oscCfg,msg));
        msg.send("/settings/etcElement/update",oscCfg);
    });
}
