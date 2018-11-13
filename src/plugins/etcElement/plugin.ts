
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
import { oscMsg, oscCfg } from 'osc';
import { oscDest } from 'oscPlugin';
import { EventEmitter } from 'events';
import { ETCConfig } from './typings/config';
import { isIPv4 } from 'net';
import { networkInterfaces } from 'os';

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
        if(config) {
            config.remoteAddress = cfg.OSCAddress,
            config.remotePort = cfg.OSCPort
        } else {
            config = {
                remoteAddress: cfg.OSCAddress,
                remotePort: cfg.OSCPort
            }
        }
    }
    msg.once("/config/get/etcElement",(cfg:ETCConfig) => {
        updateConfig(cfg);
        let oscPort = new oscPortWrapper(msg, config);
        let element = board(oscPort);
        msg.on("/board/command", function (cmd: string, ...args: any[]) {
            element[cmd].apply(element, args);
        });
        msg.on("/board/ping", function() {
            element.ping("Synapse Lighting Poll",200).then((response) => {
                if(response) {
                    msg.send("/board/ping/response");
                } else {
                    msg.send("/board/ping/timeout");
                }
            });
        });
        // When UI asks for available actions for troubleshooting connection...
        msg.on("/board/ping/getActions", () => {
            msg.send("/board/ping/actions",[
                {
                    display: "Configure OSC TX",
                    action: "/board/configTX"
                }
            ])
        });
        msg.on("/board/configTX", () => {
            let interfaces = networkInterfaces();
            Object.keys(interfaces).forEach((key) => {
                for (let j = 0; j < interfaces[key].length; j++) {
                    const nif = interfaces[key][j];
                    if (nif.family == "IPv4") {
                        let netmask = nif.netmask.split(".").map((v) => Number(v));
                        let ip = nif.address.split(".").map((v) => Number(v));
                        let targetIP = config.remoteAddress.split(".").map((v) => Number(v));
                        let isMatch = true;
                        for (let i = 0; i < 4; i++) {
                            let matches = (((~(ip[i] ^ targetIP[i])) & netmask[i]) == netmask[i]);
                            if (!matches) {
                                isMatch = false;
                                break;
                            }
                        }
                        if (isMatch) {
                            msg.once("/config/get/oscPort", (oscCfg:oscCfg) => {
                                configureTX(msg,config,nif.address,(oscCfg.localPort || 57121));
                            });
                            msg.send("/config/get","oscPort");
                            break;
                        } else {
                            continue;
                        }
                    } 
                }
                // interfaces[key].forEach((nif) => {
                //     if(nif.family=="IPv4") {
                //         let netmask = nif.netmask.split(".").map((v) => Number(v));
                //         let ip = nif.address.split(".").map((v) => Number(v));
                //         let targetIP = config.remoteAddress.split(".").map((v) => Number(v));
                //         let isMatch = true;
                //         for (let i = 0; i < 4; i++) {
                //             let matches = ( ( ( ~( ip[i] ^ targetIP[i] ) ) & netmask[i] ) == netmask[i] );
                //             if(!matches) {
                //                 isMatch = false;
                //                 break;
                //             }
                //         }
                //         if(!isMatch) {
                //             continue;
                //         }
                //     } 
                // });
            });
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

function configureTX(msg:Messager, dest:oscDest, ip:string, port:number) {
    if(isIPv4(ip)) {
        msg.emit("/oscPort/out", dest, { address: "/eos/key/osc_tx_ip_address" } as oscMsg);
        msg.emit("/oscPort/out", dest, { address: "/eos/key/clear_text" } as oscMsg);
        // Get local address
        for (let i = 0; i < ip.length; i++) {
            const char = ip[i];
            msg.emit("/oscPort/out", dest, { address: `/eos/key/${char}` } as oscMsg);
        }
        // Continue...
        msg.emit("/oscPort/out", dest, { address: "/eos/key/enter" } as oscMsg);
        msg.emit("/oscPort/out", dest, { address: "/eos/key/osc_tx_port_number" } as oscMsg);
        // Get port number
        let sPort = String(port);
        for (let i = 0; i < sPort.length; i++) {
            const char = sPort[i];
            msg.emit("/oscPort/out", dest, { address: `/eos/key/${char}` } as oscMsg);
        }
        // Continue...
        msg.emit("/oscPort/out", dest, { address: "/eos/key/enter" } as oscMsg);
    }
}