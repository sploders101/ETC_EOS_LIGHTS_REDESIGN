import osc = require("osc-min");
import { Messager } from "../loader";
import * as oscData from 'oscPlugin';
import * as udp from 'dgram';

let defaultConfig = {
    localAddress: "0.0.0.0",
    localPort: 57121
}



export default function init(msg: Messager) {
    let oscPort:udp.Socket;
    function updateConfig(config: osc.oscCfg) {
        if(oscPort) oscPort.close();
        oscPort = udp.createSocket('udp4');
        oscPort.on("error", (err) => {
            console.error(err);
            msg.send("/oscPort/error", err);
        });
        oscPort.on("message",(oscRaw) => {
            let oscMsg = osc.fromBuffer(oscRaw);
            if(oscMsg.oscType=="message") {
                let args = (oscMsg.args) ? (oscMsg.args.map((e) => e.value)) : (null);
                msg.send(`/oscPort/in${oscMsg.address}`, args);
                msg.send("/oscPort/in", oscMsg.address, args);
            }
        });
        oscPort.bind(config.localPort,config.localAddress);
    }
    msg.on("/oscPort/out", (dest: oscData.oscDest, oscMsg: oscData.oscMsg) => {
        let rawMsg = osc.toBuffer({
            address: oscMsg.address,
            args: oscMsg.args
            // args: (oscMsg.args) ? (oscMsg.args.map((e: any) => {
            //     if (typeof (e) == "object") { // Arguments are already typed...
            //         return e as osc.oscArg;
            //     } else { // If arguments are not typed...
            //         // Auto-type them
            //         let type: string = (() => {
            //             if (typeof (e) == "string") return "string";
            //             if (typeof (e) == "boolean") return e.toString();
            //             // Use typed variables for integers
            //             // if(typeof(e)=="number" && Math.floor(e) == e) return "integer";
            //             if (typeof (e) == "number" && Math.floor(e) != e) return "float";
            //             if (Buffer.isBuffer(e)) return "blob";
            //             return "null";
            //             // I can't find any documentation on bangs. If someone sends me some better docs, I will add bangs
            //         })();

            //         return {
            //             type,
            //             value: e,
            //         } as osc.oscArg;
            //     }
            // })) : (null)
        });

        oscPort.send(rawMsg,dest.remotePort,dest.remoteAddress);
    })

    // Setup using configManager
    msg.once("/config/get/oscPort", updateConfig);
    msg.send("/config/get", "oscPort", defaultConfig);

    // Allow runtime config updates
    msg.on("/oscPort/settings/save", (config: osc.oscCfg) => {
        updateConfig(config);
        msg.send("/config/set", "oscPort", config);
    });
    msg.on("/oscPort/getConfig", () => {
        msg.send("/config/get", "oscPort", defaultConfig);
    });

    msg.on("/home/mounted", () => {
        msg.send("/home/add", `${__dirname}/ui/home`);
    });
    msg.on("/settings/mounted", () => {
        msg.send("/settings/add", `${__dirname}/ui/settings`);
    });

}
