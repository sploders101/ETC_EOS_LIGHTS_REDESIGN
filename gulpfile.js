let gulp = require("gulp");
let vueify = require("gulp-vueify");
let path = require("path");
let webpack = require("webpack-stream");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

// Electron rendering
gulp.task("vue", function() {
	return gulp.src("ui/src/components/**/*.vue")
		.pipe(vueify())
		.pipe(gulp.dest("ui/dist/components/"));
});
gulp.task("js", function() {
	return gulp.src("ui/src/js/**/*.js")
		.pipe(gulp.dest("ui/dist/js/"));
});
gulp.task("html", function() {
	return gulp.src("ui/src/index.html")
		.pipe(gulp.dest("ui/dist/"));
});

// Web rendering
gulp.task("wjs", function() {
	return gulp.src("web/mobile/src/main.js")
		.pipe(webpack({
			mode: "development",
			output: {
				filename: '[name].js'
			},
			module: {
				rules: [
					{
						test: /\.vue$/,
						loader: "vue-loader",
					},
					{
						test: /\.scss$/,
						use: [
							"vue-style-loader",
							"css-loader",
							"sass-loader"
						]
					},
					{
						test: /\.css$/,
						use: [
							"vue-style-loader",
							"css-loader"
						]
					}
				]
			},
			plugins: [
				new VueLoaderPlugin()
			],
			resolve: {
				alias: {
					'vue$': 'vue/dist/vue.esm.js',
					projectRoot: __dirname,
					webroot: path.join(__dirname,"web/mobile/src"),
					components: path.join(__dirname,"web/mobile/src/components")
				}
			}
		}))
		.pipe(gulp.dest("web/mobile/dist"))
});
gulp.task("whtml", function() {
	return gulp.src("web/mobile/src/**/*.html")
		.pipe(gulp.dest("web/mobile/dist"));
});

// Build Groups
gulp.task("electron",["vue","js","html"]);
gulp.task("web",["wjs","whtml"]);

// Build Scripts
gulp.task("build",["electron","web"]);
gulp.task("test",["build"],function() {
	require("child_process").execSync(`"${__dirname}/node_modules/electron/dist/electron" ./`,{
		stdio: [0,1,2]
	});
});
