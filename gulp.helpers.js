let { Transform } = require("stream");
let vm = require("vm");
let cp = require("child_process");
let path = require("path");


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
            contents = contents.replace(/(\s*\/\/ beacon):if\((.*)\)((?:\r|\n|.)*?)(\s*\/\/ beacon):endif/mg, (_, p1, p2, p3, p4) => {
                return (vm.runInContext(p2, this.ctx)) ? (`${p1}:processed${p3}${p4}:processed`) : (`${p1}:processed${p3.replace(/(^\s*)(\S)/gm,(_,p1,p2) => `${p1}// ${p2}`)}${p4}:processed`);
            });

            file.contents = Buffer.from(contents, "utf-8");
            
            cb(error, file);
        }
    }
}

class RebuildGyp extends Transform {
    constructor(version,arch) {
        super({ objectMode: true });
        this.version = version;
        this.arch = arch;
    }
    _transform(file, _, cb) {
        let error = null;

        cp.execSync(`node-gyp rebuild --dist-url=https://atom.io/download/electron --target=${this.version} --arch=${this.arch}`, {
            cwd: path.join(file.path,"../")
        });

        cb(null, file);
    }
}

class GulpDebugger extends Transform {
    constructor(expression) {
        super({ objectMode: true });
        this.expression = expression;
    }
    _transform(file, _, cb) {
        let error = null;
        // file.isBuilding = true;

        vm.runInContext(this.expression,vm.createContext({
            path,
            file,
            console
        }));

        cb(null, file);
    }
}

class ChangeMain extends Transform {
    constructor(newFile) {
        super({ objectMode: true });
        this.newFile = newFile;
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
            let contents = JSON.parse(file.contents.toString());
            
            contents.main = this.newFile;

            file.contents = Buffer.from(JSON.stringify(contents), "utf-8");

            cb(error, file);
        }
    }
}

module.exports = {
    Replacer,
    DeStream,
    Beacon,
    RebuildGyp,
    GulpDebugger,
    ChangeMain
}