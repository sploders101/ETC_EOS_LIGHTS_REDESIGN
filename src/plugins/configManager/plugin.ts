import { Messager } from '../loader';
import fs = require("fs");
import path = require("path");
import { app } from 'electron';

let configs = new Map<string,object>();

export default function init(msg:Messager) {

    let files = fs.readdirSync(app.getPath("userData"));
    files.forEach((file) => {
        let matches = (/^pluginconfig_(.*).json$/g).exec(file);
        if(matches) {
            configs.set(matches[1],
                JSON.parse(
                    fs.readFileSync(
                        path.join(
                            app.getPath("userData"),
                            file
                        )
                    ).toString()
                )
            );
        }
    });

    msg.on("/home/mounted", () => {
        msg.send("/home/add", `${__dirname}/ui/home`);
    });

    msg.on("/config/get",(configName:string, defaultConfig:object) => {
        msg.send(`/config/get/${configName}`, (configs.has(configName)) ? (configs.get(configName)) : (defaultConfig));
    });
    msg.on("/config/set",(configName:string, config:object) => {
        configs.set(configName, config);
        let configFile = path.join(app.getPath("userData"), "pluginconfig_"+configName + ".json");
        fs.writeFile(configFile,JSON.stringify(config,null,4)+"\n",(err) => {
            if(err) throw err;
            msg.send("/config/set/"+configName);
        });
    })
}