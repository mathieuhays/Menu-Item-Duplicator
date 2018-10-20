/**
 * Gulp Config
 */

const PATH = require('path');
const GULP = require('gulp');
const UGLIFY = require('gulp-uglify');
const RENAME = require('gulp-rename');
const GUTIL = require('gulp-util');

const JS_FILES = [ PATH.join( __dirname, 'src', '*.js' ) ];
const JS_OUT = PATH.join(__dirname, 'dist');

GULP.task('js:build:production', () => {
    GULP.src(JS_FILES)
        .pipe(UGLIFY().on('error', GUTIL.log))
        .pipe(RENAME({ suffix: '.min' }))
        .pipe(GULP.dest(JS_OUT));
});

GULP.task('build', [ 'js:build:production' ]);
GULP.task('default', [ 'build' ]);