import { Messager } from '../loader';
import { fxUIDescriptor } from '../fxUI/ui/typings';

interface fxDescriptor {
    interface: string;
    duration: number;
    running: boolean;
}

class TapClick extends Array<number> {
    numElements: number;
    interval: number;
    startTime: number;
    name: string;
    constructor(name:string, numElements:number) {
        super();
        this.name = name;
        this.numElements = numElements;

        // Initialize with 0s
        for (let i = 0; i < numElements; i++) {
            this.push(0);
        }
    }

    // Add new time and calculate avg
    scroll(e:number) {
        this.push(e);
        // Shorten the array to fit numElements
        if(this.length > this.numElements) {
            this.splice(0,this.length - this.numElements);
        }
        this.interval = this
            // Get differences in time
            .map((val:number,i:number,arr:TapClick) => {
                if(i>0) {
                    return val - arr[i-1];
                } else return 0;
            })
            // Filter out the first element (it's invalid)
            .filter((num:number) => num>0)
            // Get average difference
            .reduce((prev:number, curr:number, i:number, arr:TapClick) => {
                if (i < arr.length - 1) {
                    return prev + curr;
                } else {
                    return (prev + curr) / (arr.length);
                }
            });
    }

    tap() {
        this.scroll(Date.now());
        this.startTime = Date.now() + this.interval;
    }

    seeker(duration:number) {
        return (((Date.now() - this.startTime) % (this.interval * duration)) / this.interval);
    }
}

let clicks = new Map<string, TapClick>();
let rFX = new Map<string, fxDescriptor>();

export default function init(msg:Messager) {
    msg.on("/home/mounted", () => {
        msg.send("/home/add", `${__dirname}/ui/home`);
    });

    msg.on("/fx/click/new",function(name:string, beats: number = 4) {
        clicks.set(name,new TapClick(name,beats));
        let register = function() {
            msg.send("/fxui/click/register", {
                displayName: name,
                name: name,
                state: false
            } as fxUIDescriptor);
        }
        register();
        msg.on("/fxui/mounted",register);
        msg.on(`/fx/click/${name}/tap`,() => {
            clicks.get(name)!.tap();
        });
        msg.on(`/fx/click/${name}/setDefault`, () => {
            clicks.set("default",clicks.get(name)!);
            msg.send("/fx/click/default", clicks.get("default")!.name);
        });
        msg.on(`/fx/click/${name}/remove`, () => {
            msg.removeAllListeners(`/fx/click/${name}/tap`);
            msg.removeAllListeners(`/fx/click/${name}/setDefault`);
            msg.removeAllListeners(`/fx/click/${name}/remove`);
            clicks.delete(name);
        });
    });
    msg.on("/fxui/mounted",() => {
        msg.send("/fx/click/default", clicks.get("default")!.name);
    });
    msg.on("/fx/click/getDefault", () => {
        msg.send("/fx/click/default",clicks.get("default")!.name);
    });

    // Initialize a default TapClick
    msg.emit("/fx/click/new","main",4);
    msg.emit("/fx/click/main/setDefault");

    // Allow FX to register themselves
    msg.on("/fx/register", (name: string, duration: number) => {
        // Set event listeners
        msg.on(`/fx/${name}/play`, () => {
            rFX.get(name)!.running = true;
        });
        msg.on(`/fx/${name}/pause`, () => {
            rFX.get(name)!.running = false;
        });
        msg.on(`/fx/${name}/stop`, () => {
            msg.emit(`/fx/${name}/pause`);
        });
        msg.on(`/fx/${name}/use`, (clickName: string) => {
            rFX.get(name)!.interface = clickName;
        });
        msg.on(`/fx/${name}/remove`, () => {
            rFX.delete(name);
        });

        // Set current click interface
        rFX.set(name, {
            interface: "default",
            duration,
            running: false
        });
    });

    setInterval(() => {
        rFX.forEach((desc, name) => {
            if (desc.running)
                msg.emit(`/anime/${name}/seek`, clicks.get(desc.interface)!.seeker(desc.duration));
        });
    });

}
