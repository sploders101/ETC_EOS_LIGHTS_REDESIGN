let ts = require("typescript");
let fs = require("fs");

module.exports = {
    // configure a built-in compiler
    // sass: {
    //     includePaths: [...]
    // },
    // provide your own postcss plugins
    // postcss: [...],
    // register custom compilers
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

            cb(null, result.outputTexts);
        }
    }
}