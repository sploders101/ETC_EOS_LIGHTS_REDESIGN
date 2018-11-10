import osc = require("osc");
import { Messager } from '../loader';
import { oscDest } from 'oscPlugin';

let defaultConfig:osc.oscCfg = {
    localAddress: "0.0.0.0",
    localPort: 57121
}

let oscPort: osc.UDPPort;

export default function init(msg: Messager) {

    // Setup oscPort
    function updateConfig(config: osc.oscCfg) {

        //Normalize config options
        const IPMatch = /[^1234567890.]/u;
        if (config.localAddress.match(IPMatch)) {
            throw new Error("localAddress is not correct format. Please fix and try again");
        }

        if (oscPort) oscPort.close();
        oscPort = new osc.UDPPort(config);
        oscPort.on("error", (error: Error) => {
            msg.send("/oscPort/error", error);
        });
        oscPort.on("message", function (oscMsg: osc.oscMsg) {
            msg.send(`/oscPort/in${oscMsg.address}`, oscMsg.args);
            msg.send("/oscPort/in", oscMsg.address, oscMsg.args);
        });
        oscPort.open();
    }
    msg.on("/oscPort/out", (dest: oscDest, oscMsg: osc.oscMsg) => {
        oscPort.send(oscMsg,dest.remoteAddress,dest.remotePort);
    });

    // Setup using configManager
    msg.once("/config/get/oscPort",updateConfig);
    msg.send("/config/get","oscPort",defaultConfig);

    // Allow runtime config updates
    msg.on("/oscPort/settings/save",(config: osc.oscCfg) => {
        updateConfig(config);
        msg.send("/config/set","oscPort",config);
    });
    msg.on("/oscPort/getConfig",() => {
        msg.send("/config/get","oscPort",defaultConfig);
    });

    msg.on("/home/mounted", () => {
        msg.send("/home/add", `${__dirname}/ui/home`);
    });
    msg.on("/settings/mounted", () => {
        msg.send("/settings/add", `${__dirname}/ui/settings`);
    });

}