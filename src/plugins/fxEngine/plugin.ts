import { ipcEmitter } from '../typings/plugin';

let clicks = new Map();

export default function init(msg:ipcEmitter) {

    msg.on("/fx/click/new",function(name:string) {
        let cbs = {
            times: [] as Number[],
            running: false,
            go: function() {
                if(this.times[0]) {
                    this.times[0] = new Date().getTime();
                } else {
                    this.times.unshift(new Date().getTime());
                    if(this.times.length > 5) this.times.pop();
                }
            },
            start: function() {
                // Get average times. Seek (new Date().getTime()) / avg
                if(this.running)
                    setImmediate(this.start);
            }
        }
        clicks.set(name,cbs);
        msg.on(`/fx/click/${name}/go`,cbs.go);
    });

    msg.on("/fx/click/remove",function(name:string) {
        let cbs = clicks.get(name);
        msg.removeListener(`/fx/click/${name}/go`,cbs.go);
    });

}