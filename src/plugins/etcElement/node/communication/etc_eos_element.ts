import {boardAPI} from '../../../../interfaces';

export default function(oscPort: any): boardAPI {

    let subMixes = new Map<string, Map<number, number>>();
    // let subBlendModes = new Map<number,string>();
    let subLayers: string[] = [];

    // let paramMixes = new Map<string, Map<string, number>>();
    // let paramBlendModes = new Map<string, string>();
    // let paramLayers: string[] = [];
    
    let api = {
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
        updateSubMix: function (sub) {
            let channel: number = 0;
            subLayers.forEach((layer) => {
                // Max blend mode
                if (subMixes.get(layer)!.has(sub) && channel < subMixes.get(layer)!.get(sub!)!) {
                    channel = subMixes.get(layer)!.get(sub)!;
                }
            });
            this.sendSub(sub, channel);
        },
        updateLayerMix: function (layer) {
            subMixes.get(layer)!.forEach((_, sub) => {
                this.updateSubMix(sub);
            });
        },
        mixSub: function (command, identifier, submaster, val) {
            if (!subMixes.has(identifier)) subMixes.set(identifier, new Map<number, number>());
            switch (command) {
                case "enable":
                    if (subLayers.indexOf(identifier) >= 0) {
                        subLayers.splice(subLayers.indexOf(identifier), 1);
                    }
                    subLayers.push(identifier);
                    // this.updateLayerMix(identifier);
                    break;
                case "disable":
                    subLayers.splice(subLayers.indexOf(identifier), 1);
                    // this.updateLayerMix(identifier);
                    break;
                case "remove":
                    subLayers.splice(subLayers.indexOf(identifier), 1);
                    // this.updateLayerMix(identifier);
                    subMixes.delete(identifier);
                    break;
                case "set":
                    subMixes.get(identifier)!.set(submaster!, val!);
                    // this.updateSubMix(submaster!);
                    break;
            }
        },
        extras: {
            close: function () {
                oscPort.close();
            },
            oscPort
        }
    } as boardAPI;

    // Create our own communication loop (prevents network flooding)
    setInterval(() => {
        let activeSubs = new Array();
        subLayers.forEach((layerName) => {
            subMixes.get(layerName)!.forEach((_,sub) => {
                if(activeSubs.indexOf(sub)<0) activeSubs.push(sub);
            });
        });
        activeSubs.forEach((sub) => {
            api.updateSubMix(sub);
        })
    },1);

    return api;
};
