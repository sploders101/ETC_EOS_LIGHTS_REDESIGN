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

let env = {
    production: true
}

// ┌──────────┐
// │ Building │
// └──────────┘

function typescript() {
    return gulp.src("src/**/*.ts")
        .pipe(new Beacon(env))
        .pipe(sourceMaps.init())
        .pipe(ts())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest("build/resources/app/"));
}

function sass() {
    return gulp.src("src/**/*.scss")
    .pipe(sourceMaps.init())
    .pipe(sassS())
    .pipe(sourceMaps.write())
        .pipe(gulp.dest("build/resources/app/"));
}

function vue() {
    return gulp.src("src/**/*.vue")
        .pipe(sourceMaps.init())
        .pipe(new Beacon(env))
        .pipe(vueify())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest("build/resources/app/"));
}

function html() {
    return gulp.src("src/**/*.html")
        .pipe(gulp.dest("build/resources/app/"));
}

// ┌──────────────────────────┐
// │ Fixing module extensions │
// └──────────────────────────┘

function pluginJSON() {
    return gulp.src("src/**/package.json")
        .pipe(new Replacer(/"main": "(.*).ts"/gi, '"main": "$1.js"'))
        .pipe(gulp.dest("build/resources/app/"));
}

gulp.task("ts",typescript);
gulp.task("sass",sass);
gulp.task("vue",vue);
gulp.task("html",html);
gulp.task("pluginJSON",pluginJSON);
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

gulp.task("downloadElectron",downloadElectron);
gulp.task("package_node_modules",["package_package.json","default"],packageNodeModules);
gulp.task("package_package.json",packagePackageJSON);
gulp.task("package",["downloadElectron","package_node_modules"])