import { Messager } from '../loader';
import { UIEntry } from '../../ui/typings/navlist';

export default function init(msg:Messager) {
    
    // Add fx page
    msg.on("/ui/mounted",() => {
        msg.send("/ui/addRoute",{
            icon: "play_circle_filled",
            name: "FXLive",
            componentPath: `${__dirname}/ui/main`
        } as UIEntry);
    });

}