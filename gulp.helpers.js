let { Transform } = require("stream");
let vm = require("vm");
let cp = require("cp");


class Replacer extends Transform {
    constructor(replaceScheme, replaceWith) {
        super({ objectMode: true });
        this.replaceScheme = replaceScheme;
        this.replaceWith = replaceWith;
    }
    _transform(file, _, cb) {
        let error = null;
        file.isBuilding = true;

        if (file.isNull()) return cb(null, file);

        if (file.isStream()) {
            let deStreamer = new DeStream();
            deStreamer.pipe(new Replacer(this.replaceScheme,this.replaceWith));
            deStreamer.write(file);
        } else if (file.isBuffer()) {
            let contents = file.contents.toString();
            file.contents = Buffer.from(contents.replace(this.replaceScheme, this.replaceWith), "utf-8");
            cb(error, file);
        }
    }
}

class DeStream extends Transform {
    constructor() {
        super({ objectMode: true });
    }
    _transform(file, _, cb) {
        let error = null;
        file.isBuilding = true;

        if (file.isNull()) return cb(null, file);

        if (file.isStream()) {
            let contents = Buffer.alloc(0);
            file.contents.on("data",(chunk) => {
                contents = Buffer.concat(contents,chunk);
            });
            file.contents.on("end",() => {
                file.contents = contents;
                cb(null, file);
            });
        } else if (file.isBuffer()) {
            cb(null, file);
        }
    }
}

class Beacon extends Transform {
    constructor(env) {
        super({ objectMode: true });
        this.ctx = vm.createContext(env);
    }
    _transform(file, _, cb) {
        let error = null;
        file.isBuilding = true;

        if (file.isNull()) return cb(null, file);

        if (file.isStream()) {
            let deStreamer = new DeStream();
            deStreamer.pipe(new Beacon());
            deStreamer.write(file);
        } else if (file.isBuffer()) {
            let contents = file.contents.toString();
            
            // beacon:if(expression)
            // ...
            // beacon:endif
            contents = contents.replace(/\s*\/\/ beacon:if\((.*)\)((?:\n|.)*?)\s*\/\/ beacon:endif/mg, (_, p1, p2) => {
                return (vm.runInContext(p1, this.ctx)) ? (p2) : ("");
            });

            file.contents = Buffer.from(contents, "utf-8");
            
            cb(error, file);
        }
    }
}

class RebuildGyp extends Transform {
    constructor() {
        super({objectMode: true});
    }
    _transform(file, _, cb) {
        let error = null;
        file.isBuilding = true;

        if(file.basename=="binding.gyp") {
            cp.execSync(`node-gyp rebuild --dist-url=https://atom.io/download/electron --target=${version} --arch=${arch}`, {
                cwd: file.dirname
            });
        }

        cb(null,file);
    }
}

module.exports = {
    Replacer,
    DeStream,
    Beacon,
    RebuildGyp
}