import { Messager } from '../loader';
import { UIEntry } from '../../ui/typings/navlist';

export default function init(msg:Messager) {
    msg.on("/home/mounted", () => {
        msg.send("/home/add", `${__dirname}/ui/home`);
    });
    
    // Add fx page
    msg.on("/ui/mounted",() => {
        msg.send("/ui/addRoute",{
            icon: "play_circle_filled",
            name: "FXLive",
            componentPath: `${__dirname}/ui/main`
        } as UIEntry);
    });

}