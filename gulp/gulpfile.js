var gulp = require("gulp");
var webserver = require('gulp-webserver');

/**
 * Embedded webserver for test convenience.
 */
gulp.task('webserver', function () {
    gulp.src('../.').pipe(webserver({
        port: 1339,
        livereload: false
        }));
});