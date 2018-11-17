import osc = require("osc-min");
import { Messager } from "../loader";
import { oscDest } from 'oscPlugin';
import * as udp from 'dgram';

let defaultConfig = {
    localAddress: "0.0.0.0",
    localPort: 57121
}



export default function init(msg: Messager) {
    let oscPort = udp.createSocket('udp4');
    oscPort.on("error", (err) => {
        console.error(err);
        msg.send("/oscPort/error", err);
    });
    oscPort.on("message",(oscRaw) => {
        let oscMsg = osc.fromBuffer(oscRaw);
        if(oscMsg.oscType=="message") {
            
        }
    });
    oscPort.bind(5111);

}
