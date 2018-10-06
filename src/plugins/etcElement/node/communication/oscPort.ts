var debug = require("debug")("EOS:oscPort");
debug.incomingMsg = require("debug")("EOS:oscPort:incoming");
debug.outgoingMsg = require("debug")("EOS:oscPort:outgoing");
let osc = require("osc");
import * as os from 'os';
var netmask = require("netmask").Netmask;
var EventEmitter = require("events");
class EventHandler extends EventEmitter { }
import {oscCfg,oscMsg} from '../../typings/interfaces';

let oscPort: any;

//ONLY SUPPORTS IPV4!
//Not 100% accurate, but should work in most cases.
function findRoute(ip:string):string {
    let interfaces = os.networkInterfaces(); //Get interfaces
    for (var i in interfaces) {
        const nif = interfaces[i];
        for (var j = 0; j < nif.length; j++) { //Many interfaces have 2 IPs
            if (nif[j].family == "IPv4") { //Find the IPv4 address
                //Calculae range of subnet
                var block = new netmask(nif[j].address, nif[j].netmask);
                if (block.contains(ip)) { //Return if ip is within range
                    debug("Using ip " + nif[j].address);
                    return nif[j].address;
                }
            }
        }
    }
    return "0.0.0.0";
}

export default function (oscCfg:oscCfg) {
    return new Promise(function (resolve) {
        //Normalize config options
        const IPMatch = /[^1234567890.]/u;
        if (oscCfg.port.remoteAddress.match(IPMatch)) {
            throw new Error("remoteAddress is not correct format. Please fix and try again");
        }
        if (oscCfg.port.localAddress === "find") {
            oscCfg.port.localAddress = findRoute(oscCfg.port.remoteAddress);
        } else if (oscCfg.port.localAddress.match(IPMatch)) {
            throw new Error("localAddress is not correct format. Please fix and try again");
        }
        if (Number(oscCfg.port.remotePort) != oscCfg.port.remotePort) {
            throw new Error("remotePort is not correct format. Please fix and try again");
        }
        if (Number(oscCfg.port.localPort) != oscCfg.port.localPort) {
            throw new Error("localPort is not correct format. Please fix and try again");
        }

        //Open port
        debug("Creating oscPort");
        oscPort = new osc.UDPPort(oscCfg.port);
        //When ready, set up board
        oscPort.on("ready", function () {
            // debug("Created oscPort, Configuring light board...");
            //####################################################################//
            //####################################################################//
            //Ping board. If there is no response, then enable TX and ping again. If
            //there is still no response, throw an error
            // global.modules.oscHelper.ping("Initialization ping", 500).then(function (responded) {
            //     if (responded) {
            //         debug("Board responded!");
            //         resolve(oscPort);
            //     } else {
            //         debug("Input correct TX IP address") //------
            //         oscPort.send({
            //             address: "/eos/key/osc_tx_ip_address"
            //         });
            //         oscPort.send({
            //             address: "/eos/key/clear_text"
            //         });
            //         for (var i = 0; i < oscCfg.port.localAddress.length; i++) {
            //             oscPort.send({
            //                 address: "/eos/key/" + oscCfg.port.localAddress[i]
            //             });
            //         }
            //         oscPort.send({
            //             address: "/eos/key/enter"
            //         });

            //         debug("Input correct TX port"); //------
            //         oscPort.send({
            //             address: "/eos/key/osc_tx_port_number"
            //         });
            //         for (var i = 0; i < String(oscCfg.port.localPort).length; i++) {
            //             oscPort.send({
            //                 address: "/eos/key/" + String(oscCfg.port.localPort)[i]
            //             });
            //         }
            //         oscPort.send({
            //             address: "/eos/key/enter"
            //         });

            //         //Ping board. If there is no response, then enable TX and ping again. If
            //         //there is still no response, throw an error
            //         global.modules.oscHelper.initPing("Initialization ping").then(function (responded) {
            //             if (responded) {
            //                 debug("Board responded!");
                            resolve(oscPort);
            //             }
            //         });
            //     }
            // });
        });
        oscPort.on("error", console.error);

        //Set up event routers
        oscPort.msgRouter = new EventHandler();
        oscPort.sendMsg = (obj:any) => {
            debug.outgoingMsg(obj);
            oscPort.send(obj);
        };
        oscPort.on("message", function (oscMsg:oscMsg) {
            debug.incomingMsg("Received: " + JSON.stringify(oscMsg));
            oscPort.msgRouter.emit(oscMsg.address, oscMsg.args);
        });

        oscPort.open();
    });
}
