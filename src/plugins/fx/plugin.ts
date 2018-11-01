import anime = require("animejs");
import {ipcEmitter} from '../typings/plugin';

// interfaces
interface timelineDescriptor {
    start?: boolean;
    name: string;
    linkToSubs: boolean;
    common: anime.AnimeAnimParams;
    objects: anime.AnimeParams[];
}
interface SubKey {
    key: string;
    sub: number;
}

let timelines = new Map();

export default function init(msg:ipcEmitter) {
    msg.on("/anime/timeline/new", function(desc:timelineDescriptor) {

        // Create an array of mappings to link anime with submasters
        let keys:SubKey[];
        if (desc.linkToSubs) {
            keys = Object.keys(desc.common.targets as any).map((v,i) => {
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
                msg.send(`/anime/timeline/event/${desc.name}/update`,desc.common.targets);
                // Send any values that we have mappings for
                for (let i = 0; i < keys.length; i++) {
                    const e = keys[i];
                    msg.emit("/board/command", "mixSub", e.sub, desc.common.targets![e.key], `fx:${desc.name}:set`);
                }
            },
            begin: function() {
                msg.send(`/anime/timeline/event/${desc.name}/begin`);
                for (let i = 0; i < keys.length; i++) {
                    const e = keys[i];
                    msg.emit("/board/command", "mixSub", e.sub, -1, `fx:${desc.name}:enable`);
                }
            },
            complete: function() {
                msg.send(`/anime/timeline/event/${desc.name}/complete`);
            }
        } as anime.AnimeInstanceParams));
        for (let i = 0; i < desc.objects.length; i++) {
            atl.add(desc.objects[i]);
        }
        timelines.set(desc.name,atl);
    });
    msg.on("/anime/timeline/play", function(name:string) {
        timelines.get(name).play();
    });
    msg.on("/anime/timeline/pause",function(name:string) {
        timelines.get(name).pause();
    });
    msg.on("/anime/timeline/seek", function(name:string,time:number) {
        timelines.get(name).seek(time);
    });
    msg.on("/anime/timeline/remove",function(name:string) {
        timelines.get(name).pause();
        timelines.delete(name);
    });
    msg.on("/anime/timeline/stopall",function() {
        timelines.forEach((v,k) => {
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

