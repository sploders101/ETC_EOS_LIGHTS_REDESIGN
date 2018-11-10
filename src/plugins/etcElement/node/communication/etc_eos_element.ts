import {boardAPI} from '../../../../interfaces';

export default function(oscPort: any): boardAPI {
    
    return {
        ping: function (text, timeout) {
            return new Promise(function (resolve) {

                if (typeof (text) != "string") text = "";

                oscPort.sendMsg({
                    address: "/eos/ping",
                    args: text
                });

                let timeoutFunc;
                if (timeout) {
                    timeoutFunc = setTimeout(function () {
                        resolve(false);
                    }, timeout);
                }
                var listen = function () {
                    oscPort.msgRouter.once("/eos/out/ping", function (arg: string) {
                        if (arg == text) {
                            if (timeout) {
                                clearInterval(timeout);
                            }
                            resolve(true);
                        } else {
                            listen();
                        }
                    });
                }
                listen();
            });
        },
        initPing: function (text, timeout) {
            return new Promise(function (resolve) {
                // resolve(true);
                if (!timeout) {
                    timeout = 500
                }

                if (typeof (text) != "string") text = "";

                oscPort.sendMsg({
                    address: "/eos/ping",
                    args: text
                });

                let interval = setInterval(function () {
                    oscPort.sendMsg({
                        address: "/eos/ping",
                        args: text
                    });
                }, timeout);


                var listen = function () {
                    oscPort.msgRouter.once("/eos/out/ping", function (arg: string) {
                        if (arg == text) {
                            if (timeout) {
                                clearInterval(interval);
                            }
                            resolve(true);
                        } else {
                            listen();
                        }
                    });
                }
                listen();
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
        },
        extras: {
            close: function () {
                oscPort.close();
            },
            oscPort
        }
    } as boardAPI;
};
