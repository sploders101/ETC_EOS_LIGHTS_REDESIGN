import {boardAPI} from '../../interfaces';
import {oscPortWrapper} from './plugin';

export default function(oscPort: oscPortWrapper): boardAPI {
    
    return {
        ping: function (text, timeout) {
            return new Promise<boolean>(function (resolve) {

                if (typeof (text) != "string") text = "";
                
                let timeoutFunc:NodeJS.Timer;
                function listener (arg: string) {
                    if (arg == text) {
                        if (timeout && timeoutFunc) {
                            clearInterval(timeoutFunc);
                        }
                        resolve(true);
                    } else {
                        listen();
                    }
                }
                
                if (timeout) {
                    timeoutFunc = setTimeout(function () {
                        oscPort.msgRouter.removeListener("/eos/out/ping",listener);
                        resolve(false);
                    }, timeout);
                }
                var listen = function () {
                    oscPort.msgRouter.once("/eos/out/ping", listener);
                }
                listen();

                oscPort.sendMsg({
                    address: "/eos/ping",
                    args: text
                });
            });
        },
        sendSub: function (sub, val) {
            oscPort.sendMsg({
                address: `/eos/sub/${sub}`,
                args: val
            });
        },
        sendFader: function (fader, val) {
            oscPort.sendMsg({
                address: `/eos/fader/1/${fader}`,
                args: val
            });
        },
        getFaders: function (numFaders) {
            oscPort.sendMsg({
                address: `/eos/fader/1/config/${numFaders}`
            });
        },
        setSubName: function (sub, name) {
            oscPort.sendMsg({
                address: `/eos/set/sub/${sub}/label`,
                args: name
            });
        },
        setParam: function (channel, param, value) {
            oscPort.sendMsg({
                address: `/eos/chan/${channel}/param/${param}`,
                args: value
            });
        }
    } as boardAPI;
};
