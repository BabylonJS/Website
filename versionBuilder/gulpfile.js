var gulp = require("gulp");
var webserver = require('gulp-webserver');
var uglify = require("gulp-uglify");

/**
 * Web server task to serve a local test page
 */
gulp.task('webserver', function () {
    gulp.src('.')
        .pipe(webserver({
            livereload: false,
            open: 'http://localhost:1338/index.html',
            port: 1338,
            fallback: 'index.html'
        }));
});

