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
    function updateConfig(config: oscData.oscCfg) {
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
        });

        oscPort.send(rawMsg,dest.remotePort,dest.remoteAddress);
    })

    // Setup using configManager
    msg.once("/config/get/oscPort", updateConfig);
    msg.send("/config/get", "oscPort", defaultConfig);

    // Allow runtime config updates
    msg.on("/oscPort/settings/save", (config: oscData.oscCfg) => {
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
