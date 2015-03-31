var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    typescript = require('gulp-typescript'),
	  sourcemaps = require('gulp-sourcemaps'),
    gulpFilter = require('gulp-filter');

/**
 * Compile typescript files to their js respective files
 */
gulp.task('typescript-to-js', function() {
  //Compile all ts file into their respective js file.
  
  var tsResult = gulp.src(['./*.ts'])
                       .pipe(sourcemaps.init()) // This means sourcemaps will be generated
                       .pipe(typescript({ 
                          noExternalResolve: true, 
                          declarationFiles: true,
                          target: 'ES5'}));
  
   return tsResult.js
                .pipe(sourcemaps.write('.')) // Now the sourcemaps are added to the .js file
                .pipe(gulp.dest('.'));
});

/**
 * Compile the declaration file vorlon.d.ts
 */
gulp.task('typescript-declaration', ['typescript-to-js'], function() {
	
	var tsResult = gulp.src(['./*.ts'])
                       .pipe(typescript({
                           declarationFiles: true,
                           noExternalResolve: true,
						   target: 'ES5'
                       }));

    return tsResult.dts.pipe(concat('boxmonger.d.ts'))
	.pipe(gulp.dest('.'));
});

gulp.task('default', function() {
    gulp.start('typescript-to-js', 'typescript-declaration');
});