import { Messager } from '../loader';
import fs = require("fs");
import path = require("path");
import { app } from 'electron';

if(!fs.existsSync(app.getPath("userData"))) {
    fs.mkdirSync(app.getPath("userData"));
}

export default function init(msg:Messager) {
    msg.on("/config/get",(configName:string, defaultConfig:object) => {
        let configFile = path.join(app.getPath("userData"), configName + ".json");
        if(fs.existsSync(configFile)) {
            fs.readFile(configFile,(err,data) => {
                if(err) throw err;
                msg.send("/config/get/"+configName,JSON.parse(data.toString()));
            });
        } else {
            msg.send("/config/get/"+configName,defaultConfig);
        }
    });
    msg.on("/config/set",(configName:string, config:object) => {
        let configFile = path.join(app.getPath("userData"), configName + ".json");
        fs.writeFile(configFile,JSON.stringify(config,null,4)+"\n",(err) => {
            if(err) throw err;
            msg.send("/config/set/"+configName);
        });
    })
}