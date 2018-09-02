let gulp = require("gulp");
let vueify = require("gulp-vueify");
let path = require("path");

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
})

gulp.task("build",["html","vue","js"]);
gulp.task("test",["build"],function() {
	require("child_process").execSync(`"${__dirname}/node_modules/electron/dist/electron" ./`,{
		stdio: [0,1,2]
	});
});
