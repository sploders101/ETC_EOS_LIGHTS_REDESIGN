import { Messager } from '../loader';

let subLayers: string[] = [];
let subMixes = new Map<string, Map<number, number>>();

export default function init(msg:Messager) {
    msg.on("/board/mixer", function(command:string, identifier:string, submaster:number, val:number) {
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
                updateLayerMix(identifier);
                subLayers.splice(subLayers.indexOf(identifier), 1);
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
    });

    function updateLayerMix(layer: string) {
        subMixes.get(layer)!.forEach((_, sub) => {
            updateSubMix(sub);
        });
    }

    function updateSubMix(sub: number) {
        let channel: number = 0;
        subLayers.forEach((layer) => {
            // Max blend mode
            if (subMixes.get(layer)!.has(sub) && channel < subMixes.get(layer)!.get(sub!)!) {
                channel = subMixes.get(layer)!.get(sub)!;
            }
        });
        msg.emit("/board/command", "sendSub", sub, channel);
    }

    // Create our own communication loop (prevents network flooding)
    setInterval(() => {
        let activeSubs = new Array();
        subLayers.forEach((layerName) => {
            subMixes.get(layerName)!.forEach((_, sub) => {
                if (activeSubs.indexOf(sub) < 0) activeSubs.push(sub);
            });
        });
        activeSubs.forEach((sub) => {
            updateSubMix(sub);
        })
    }, 10);

    msg.on("/home/mounted", () => {
        msg.send("/home/add", `${__dirname}/ui/home`);
    });
}
