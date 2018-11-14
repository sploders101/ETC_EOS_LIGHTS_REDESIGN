let {Transform, PluginError} = require("stream");
let gulp = require("gulp");
let sourceMaps = require("gulp-sourcemaps");
let ts = require("gulp-typescript").createProject('tsconfig.json');
let sassS = require("gulp-sass");
let vueify = require("gulp-vueify");

class PluginJSON extends Transform {
    constructor() {
        super({ objectMode: true });
    }
    _transform(file, encoding, cb) {
        let error = null;
        file.isBuilding = true;

        if (file.isNull()) return cb(null, file);

        if (file.isStream()) {
            this.emit("error", new PluginError(PLUGIN_NAME, "Streams not yet supported!"));
        } else if (file.isBuffer()) {
            let contents = file.contents.toString();
            file.contents = Buffer.from(contents.replace(/"main": "(.*).ts"/gi, '"main": "$1.js"'), "utf-8");
            cb(error, file);
        }
    }
}

class ModuleJSON extends Transform {
    constructor() {
        super({ objectMode: true });
    }
    _transform(file, encoding, cb) {
        let error = null;
        file.isBuilding = true;

        if (file.isNull()) return cb(null, file);

        if (file.isStream()) {
            this.emit("error", new PluginError(PLUGIN_NAME, "Streams not yet supported!"));
        } else if (file.isBuffer()) {
            let contents = JSON.parse(file.contents.toString());
            if(contents.module) contents.main = contents.module;
            file.contents = Buffer.from(JSON.stringify(contents,null, 2));
            cb(error, file);
        }
    }
}

function typescript() {
    return gulp.src("src/**/*.ts")
        .pipe(sourceMaps.init())
        .pipe(ts())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest("out/"));
}

function sass() {
    return gulp.src("src/**/*.scss")
        .pipe(sourceMaps.init())
        .pipe(sassS())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest("out/"));
}

function vue() {
    return gulp.src("src/**/*.vue")
        .pipe(sourceMaps.init())
        .pipe(vueify())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest("out/"));
}

function html() {
    return gulp.src("src/**/*.html")
        .pipe(gulp.dest("out/"));
}

function pluginJSON() {
    return gulp.src("src/**/package.json")
        .pipe(new PluginJSON())
        .pipe(gulp.dest("out/"));
}

function moduleJSON() {
    return gulp.src("node_modules/**/package.json")
        .pipe(new ModuleJSON())
        .pipe(gulp.dest("out/"));
}

gulp.task("ts",typescript);
gulp.task("sass",sass);
gulp.task("vue",vue);
gulp.task("html",html);
gulp.task("pluginJSON",pluginJSON);
gulp.task("moduleJSON",moduleJSON);
gulp.task("all",["ts","sass","vue","html","pluginJSON","moduleJSON"]);