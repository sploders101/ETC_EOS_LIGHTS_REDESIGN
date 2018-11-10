
// ┌───────────────────────────────┐
// │                               │
// │      ETC EOS Element API      │
// │                               │
// └───────────────────────────────┘

// ┌─────────┐
// │ Imports │
// └─────────┘
import board from './etc_eos_element';
import { Messager } from '../loader';
import { oscMsg } from 'osc';
import { oscDest } from 'oscPlugin';
import { EventEmitter } from 'events';
import { ETCConfig } from './typings/config';

let defaultConfig: ETCConfig = {
    OSCAddress: "0.0.0.0",
    OSCPort: 57122,
    OSCFaders: 500
};

class msgRouter extends EventEmitter {
    constructor(msg:Messager) {
        super();
        msg.on("/oscPort/in", (address: string, args: any) => {
            this.emit(address,args);
        });
    }
}

export class oscPortWrapper {
    msg: Messager;
    destination: oscDest;
    msgRouter: msgRouter;
    constructor(msg:Messager, destination: oscDest) {
        this.msg = msg;
        this.destination = destination;
        this.msgRouter = new msgRouter(msg);
    }
    sendMsg(msg:oscMsg) {
        this.msg.emit("/oscPort/out",this.destination,msg);
    }
}

export default function init(msg: Messager) {
    let config:oscDest;
    function updateConfig(cfg:ETCConfig) {
        config = {
            remoteAddress: cfg.OSCAddress,
            remotePort: cfg.OSCPort
        }
    }
    msg.once("/config/get/etcElement",(cfg:ETCConfig) => {
        updateConfig(cfg);
        let oscPort = new oscPortWrapper(msg, config);
        let element = board(oscPort);
        msg.on("/board/command", function (cmd: string, ...args: any[]) {
            element[cmd].apply(element, args);
        });
    });
    msg.emit("/config/get","etcElement",defaultConfig);

    msg.on("/etcElement/getConfig",() => {
        msg.emit("/config/get","etcElement",defaultConfig);
    });

    msg.on("/etcElement/settings/save",(cfg:ETCConfig) => {
        updateConfig(cfg);
        msg.send("/config/set","etcElement",cfg);
    });

    msg.on("/home/mounted", () => {
        msg.send("/home/add", `${__dirname}/ui/home`);
    });
    msg.on("/settings/mounted", () => {
        msg.send("/settings/add", `${__dirname}/ui/settings`);
    });
}