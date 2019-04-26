"use strict";

const gulp = require('gulp'),
      plumber = require('gulp-plumber'),
      sourcemaps = require('gulp-sourcemaps'),
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      rename = require('gulp-rename'),
      posthtml = require('gulp-posthtml'),
      include = require('posthtml-include'),
      del = require('del'),
      server = require('browser-sync').create();

/* Plumber error message
 ******************************/
const plumberLog = function(error) {
  console.log([
    '',
    '----------ERROR MESSAGE START----------',
    ('[' + error.name + ' in ' + error.plugin + ']'),
    error.message,
    '----------ERROR MESSAGE END----------',
    ''
  ].join('\n'));
  this.end();
};

/* Styles compile
******************************/
gulp.task('styles', function () {
  return gulp.src('./source/scss/main.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass()).on('error', plumberLog)
    .pipe(autoprefixer({
      browsers: [
        'last 3 versions',
        'Android 2.3',
        'Android >= 4',
        'Chrome >= 20',
        'Firefox >= 24',
        'Explorer >= 10',
        'iOS >= 6',
        'Opera >= 11',
        'Safari >= 4'
      ],
      cascade: false
    }))
    .pipe(rename('style.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./source/css'))
    .pipe(server.stream());
});

/* Server
 ******************************/
gulp.task('serve', function () {
  server.init({
    server: {
      port: 3000,
      baseDir: './source'
    },
    notify: false
  });

  gulp.watch('./source/scss/**/*.scss', gulp.series('styles'));
  gulp.watch('./source/*.html').on('change', server.reload);
});

/* Default
******************************/
gulp.task('default', gulp.series('styles', 'serve'));
