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

let timelines = new Map();

export default function init(msg:ipcEmitter) {
    msg.on("/anime/timeline/new", function(desc:timelineDescriptor) {
        console.log(desc);
        let atl = anime.timeline(Object.assign(desc.common,{
            update: function() {
                msg.send(`/anime/timeline/event/${desc.name}/update`,desc.common.targets);
                console.log(desc.common.targets);
                if(desc.linkToSubs) {
                    let keys = Object.keys(desc.common.targets as any);
                    // This could be done better. Try constructing an array of matching props on initialization
                    for (let i = 0; i < keys.length; i++) {
                        const element = keys[i];
                        const match = /^sub([0-9]+)$/g.exec(element);
                        if(match) msg.emit("/board/command","sendSub",Number(match[1]),desc.common.targets![element]);
                    }
                }
            },
            begin: function() {
                msg.send(`/anime/timeline/event/${desc.name}/begin`);
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

