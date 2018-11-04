import anime = require("animejs");
import {Messager} from '../loader';

// interfaces
interface timelineDescriptor {
    start?: boolean;
    name: string;
    linkToSubs: boolean;
    linkEngine: boolean;
    common: anime.AnimeAnimParams;
    objects: anime.AnimeParams[];
}
interface SubKey {
    key: string;
    sub: number;
}

let timelines = new Map<string, anime.AnimeTimelineInstance>();

export default function init(msg:Messager) {
    msg.on("/anime/timeline/new", function(desc:timelineDescriptor) {

        // Create an array of mappings to link anime with submasters
        let keys:SubKey[];
        if (desc.linkToSubs) {
            keys = Object.keys(desc.common.targets as any).map((v) => {
                const match = /^sub([0-9]+)$/g.exec(v);
                if(match) {
                    return {
                        key: v,
                        sub: Number(match[1])
                    }
                } else {
                    return {
                        key: "null",
                        sub: -1
                    };
                }
            }).filter((v) => {
                return (v.sub >= 0);
            });
        }
        
        // Create animation with anime
        let atl = anime.timeline(Object.assign(desc.common,{
            update: function() {
                // Report new values to anything listening
                msg.send(`/anime/${desc.name}/event/update`,desc.common.targets);
                // Send any values that we have mappings for
                for (let i = 0; i < keys.length; i++) {
                    const e = keys[i];
                    msg.emit("/board/command", "mixSub", "set", `fx:${desc.name}`, e.sub, desc.common.targets![e.key]);
                }
            },
            begin: function() {
                msg.send(`/anime/${desc.name}/event/begin`);
                for (let i = 0; i < keys.length; i++) {
                    const e = keys[i];
                    msg.emit("/board/command", "mixSub", "enable", `fx:${desc.name}`);
                }
            },
            complete: function() {
                msg.send(`/anime/${desc.name}/event/complete`);
            },
            autoplay: desc.linkEngine ? false : desc.common.autoplay
        } as anime.AnimeInstanceParams));
        for (let i = 0; i < desc.objects.length; i++) {
            atl.add(desc.objects[i]);
        }

        if (desc.linkEngine) {
            msg.emit("/fx/register",desc.name, atl.duration);
        }
        
        // Register event listeners
        msg.on(`/anime/${desc.name}/play`, function () {
            if (desc.linkEngine) { // If this effect is controlled by fxEngine...
                msg.emit(`/fx/${desc.name}/play`); // Tell effect engine to play
            } else {
                atl.play();
            }
            msg.emit("/board/command", "mixSub", "enable", `fx:${desc.name}`);
        });
        msg.on(`/anime/${desc.name}/pause`, function () {
            if (desc.linkEngine) { // If this effect is controlled by fxEngine...
                msg.emit(`/fx/${desc.name}/pause`); // Tell effect engine to pause
            } else {
                atl.pause();
            }
            // msg.emit("/board/command", "mixSub", "disable", `fx:${desc.name}`);
        });
        msg.on(`/anime/${desc.name}/stop`, function () {
            if (desc.linkEngine) {
                msg.emit(`/fx/${desc.name}/stop`);
            } else {
                atl.pause();
            }
            atl.seek(0);
            // Reset all submaster values
            keys.forEach((sub) => {
                msg.emit("/board/command", "mixSub", "set", `fx:${desc.name}`, sub.sub, 0);
            });
            // Let other effects have control
            msg.emit("/board/command", "mixSub", "disable", `fx:${desc.name}`);
        });
        msg.on(`/anime/${desc.name}/seek`, function (time: number) {
            atl.seek(time);
        });
        msg.on(`/anime/${desc.name}/remove`, function () {
            atl.pause();
            msg.emit(`/fx/${desc.name}/remove`); // Remove from fx engine
            msg.emit("/board/command", "mixSub", "remove", `fx:${desc.name}`); // Remove from SubMixer

            // Remove event listeners
            msg.removeAllListeners(`/anime/${desc.name}/play`);
            msg.removeAllListeners(`/anime/${desc.name}/pause`);
            msg.removeAllListeners(`/anime/${desc.name}/stop`);
            msg.removeAllListeners(`/anime/${desc.name}/seek`);
            msg.removeAllListeners(`/anime/${desc.name}/remove`);

            // Delete references to the effect and let it get GC'd
            timelines.delete(desc.name);
        });
        timelines.set(desc.name,atl);
    });
    msg.on(`/anime/timeline/stopall`,function() {
        timelines.forEach((v) => {
            v.pause();
            v.seek(0);
        });
    });
    msg.on("/shutdown",function() {
        timelines.forEach((v,k) => {
            v.pause();
            timelines.delete(k);
        });
    });
}
