// ┌─────────┐
// │ Imports │
// └─────────┘
let gulp = require("gulp");
let sourceMaps = require("gulp-sourcemaps");
let ts = require("gulp-typescript").createProject('tsconfig.json');
let sassS = require("gulp-sass");
let vueify = require("gulp-vueify");
let gulp_download = require("gulp-download2");
let gulp_unzip = require("gulp-unzip");
let cp = require("child_process");
let {Replacer, Beacon, RebuildGyp, ChangeMain, GulpDebugger} = require("./gulp.helpers.js");
let path = require("path");

// ┌──────────┐
// │ Building │
// └──────────┘

function typescript(destination,env) {
    return gulp.src("src/**/*.ts")
        .pipe(new Beacon(env))
        .pipe(sourceMaps.init())
        .pipe(ts())
        .pipe(sourceMaps.mapSources((_,file) => {
            return path.join(path.relative(file.path,file.base),"src",path.relative(file.base,file.path)).replace(/.js$/,".ts");
        }))
        .pipe(sourceMaps.write({
            includeContent: false
        }))
        .pipe(gulp.dest(destination));
}

function sass(destination) {
    return gulp.src("src/**/*.scss")
    .pipe(sourceMaps.init())
    .pipe(sassS())
    .pipe(sourceMaps.write())
        .pipe(gulp.dest(destination));
}

function vue(destination,env) {
    return gulp.src("src/**/*.vue")
        .pipe(sourceMaps.init())
        .pipe(new Beacon(env))
        .pipe(vueify())
        .pipe(sourceMaps.mapSources((_, file) => {
            return path.join(path.relative(file.path, file.base), "src", path.relative(file.base, file.path)).replace(/.js$/, ".vue");
        }))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest(destination));
}

function html(destination) {
    return gulp.src("src/**/*.html")
        .pipe(gulp.dest(destination));
}

// ┌──────────────────────────┐
// │ Fixing module extensions │
// └──────────────────────────┘

function pluginJSON(destination) {
    return gulp.src("src/**/package.json")
        .pipe(new Replacer(/"main": "(.*).ts"/gi, '"main": "$1.js"'))
        .pipe(gulp.dest(destination));
}

gulp.task("ts", () => typescript("out/",{production: false}));
gulp.task("sass", () => sass("out/",{production: false}));
gulp.task("vue", () => vue("out/",{production: false}));
gulp.task("html", () => html("out/",{production: false}));
gulp.task("pluginJSON", () => pluginJSON("out/"));
gulp.task("default",["ts","sass","vue","html","pluginJSON"]);

// ┌───────────┐
// │ Packaging │
// └───────────┘

const version = require("./node_modules/electron/package.json").version;
const platform = process.platform;
const arch = process.arch;

function downloadElectron() {
    const downloadURL = `https://github.com/electron/electron/releases/download/v${version}/electron-v${version}-${platform}-${arch}.zip`;
    return gulp_download(downloadURL)
        .pipe(gulp_unzip())
        .pipe(gulp.dest("build"));
}
function packageNodeModules() {
    cp.execSync("yarn install",{
        cwd: `${__dirname}/build/resources/app`
    });
    return gulp.src("build/resources/app/node_modules/**/binding.gyp")
        // .pipe(new GulpDebugger(`console.log(path.join(file.path,"../"))`))
        .pipe(new RebuildGyp(version,arch));
}
function packagePackageJSON() {
    return gulp.src("package.json")
        .pipe(new ChangeMain("index.js"))
        .pipe(gulp.dest("build/resources/app"));
}

gulp.task("buildTs", () => typescript("build/resources/app/",{production: true}));
gulp.task("buildSass", () => sass("build/resources/app/",{production: true}));
gulp.task("buildVue", () => vue("build/resources/app/",{production: true}));
gulp.task("buildHtml", () => html("build/resources/app/",{production: true}));
gulp.task("buildPluginJSON", () => pluginJSON("build/resources/app/",{production: true}));

gulp.task("downloadElectron",downloadElectron);
gulp.task("package_package.json",packagePackageJSON);
gulp.task("package_node_modules",["package_package.json","buildTs","buildSass","buildVue","buildHtml","buildPluginJSON"],packageNodeModules);
gulp.task("package",["downloadElectron","package_node_modules"])