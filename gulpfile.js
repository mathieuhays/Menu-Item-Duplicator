/**
 * Gulp Config
 */

/* global require, __dirname */

const { join } = require('path');
const { src, dest } = require('gulp');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const log = require('fancy-log');

const JS_FILES = [ join(__dirname, 'src', '*.js') ];
const JS_OUT = join(__dirname, 'dist');

function buildProductionScripts() {
  return src(JS_FILES)
    .pipe(uglify().on('error', log))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(JS_OUT));
}

exports.build = buildProductionScripts;
exports.default = buildProductionScripts;
