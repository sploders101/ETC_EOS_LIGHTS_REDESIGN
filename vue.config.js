let ts = require("typescript");
let fs = require("fs");

let moduleChanges = new Map([
    ["vue",{esm:true,path:"vue/dist/vue.esm.js"}],
    ["vue-router",{esm:true,path:"vue-router/dist/vue-router.esm.js"}]
]);

module.exports = {
    // configure a built-in compiler
    // sass: {
    //     includePaths: [...]
    // },
    // provide your own postcss plugins
    // postcss: [...],
    // register custom compilers
    runtimeCompiler: true,
    customCompilers: {
        // for tags with lang="ts"
        ts: function (content, cb, compiler, filePath) {
            // content:  content extracted from lang="ts" blocks
            // cb:       the callback to call when you're done compiling
            // compiler: the vueify compiler instance
            // filePath: the path for the file being compiled
            //
            // compile some TypeScript... and when you're done:

            // let imports = content.match(//gi);
            let result = ts.transpileModule(content, {
                compilerOptions: require(__dirname+"/tsconfig.json")
            });

            result.outputText = result.outputText.replace(/require\("(.*)"\)/g, (original, reqMod) => (moduleChanges.has(reqMod)) ? (`${(moduleChanges.get(reqMod).esm) ? ('require("esm")(module)') : ('require')}("${moduleChanges.get(reqMod).path}")`) : (original));
            `require("esm")(module)("${(moduleChanges.has(module)) ? (moduleChanges.get(module)) : (module)}")`

            cb(null, result.outputText);
        }
    }
}