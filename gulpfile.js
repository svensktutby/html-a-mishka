"use strict";

const gulp = require('gulp'),
      plumber = require('gulp-plumber'),
      sourcemaps = require('gulp-sourcemaps'),
      sass = require('gulp-sass'),
      minify = require('gulp-clean-css'),
      autoprefixer = require('gulp-autoprefixer'),
      rename = require('gulp-rename'),
      uglify = require('gulp-uglify'),
      concat = require('gulp-concat'),
      posthtml = require('gulp-posthtml'),
      include = require('posthtml-include'),
      htmlmin = require("gulp-htmlmin"),
      imagemin = require("gulp-imagemin"),
      pngquant = require('imagemin-pngquant'),
      mozjpeg = require('imagemin-mozjpeg'),
      webp = require('imagemin-webp'),
      svgstore = require('gulp-svgstore'),
      cache = require('gulp-cache'),
      extReplace = require('gulp-ext-replace'),
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
    .pipe(sass({
      includePaths: require('node-normalize-scss').includePaths
    })).on('error', plumberLog)
    .pipe(autoprefixer({
      browsers: [
        'last 2 version',
        '> 1%',
        'IE 10',
        'Firefox ESR'
      ],
      cascade: false
    }))
    .pipe(rename('style.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/css'))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("./build/css"));
});

/* Scripts
******************************/
gulp.task('scripts', function () {
  return gulp.src([
    './source/js/parts/init.js',
    './source/js/parts/burger.js',
    './source/js/parts/menu.js',
    './source/js/parts/map.js',
    './source/js/parts/modal-cart.js',
    './source/js/parts/validation.js',
    './source/js/parts/form.js',
    './source/js/parts/main.js'
  ])
    .pipe(plumber())
    .pipe(concat('script.min.js'))
    .pipe(uglify()).on('error', plumberLog)
    .pipe(gulp.dest('./build/js'));
});

/* HTML
 ******************************/
gulp.task('html', function () {
  return gulp.src('./source/*.html')
    .pipe(plumber())
    .pipe(posthtml([
      include()
    ])).on('error', plumberLog)
    .pipe(htmlmin({
      collapseWhitespace: false,
      removeComments: false
    }))
    .pipe(gulp.dest("./build"));
});

/* Server
 ******************************/
gulp.task('serve', function () {
  server.init({
    server: {
      port: 3000,
      baseDir: './build'
    },
    notify: false
  });
});

/* Watchers
******************************/
gulp.task('watch', function () {
  gulp.watch('./source/scss/**/*.scss', gulp.parallel('styles'));
  gulp.watch('./source/js/parts/**/*.js', gulp.parallel('scripts'));
  gulp.watch('./source/**/*.html', gulp.parallel('html'));
  gulp.watch('./source/img/**/{icon-*,logo-*}.svg', gulp.parallel('sprite:svg'));
  gulp.watch('./build/**/*.{css,js,html}').on('change', server.reload);
});

/* Images
******************************/
gulp.task('images', function () {
  return gulp.src('./source/img/**/*.{png,jpg,svg}')
    .pipe(cache(imagemin( // With caching
      [
      pngquant({
        quality : [0.8, 0.9],
        speed   : 2
      }),
      mozjpeg({
        progressive : true,
        quality     : 90,
        quantTable  : 2
      }),
      imagemin.svgo({
        plugins: [
          {removeViewBox: false},
          {cleanupIDs: false}
        ]
      })
    ],{
        verbose: true
      })))
    .pipe(gulp.dest('./build/img'));
});

/* WEBP
******************************/
gulp.task("webp", function () {
  return gulp.src("./source/img/**/*.{png,jpg}")
    .pipe(imagemin([
      webp({
        quality: 90
      })
    ]))
    .pipe(extReplace(".webp"))
    .pipe(gulp.dest("./build/img"));
});

/* SVG sprite
******************************/
gulp.task('sprite:svg', function () {
  return gulp.src('./source/img/{icon-*,logo-*}.svg')
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('./build/img'));
});

/* Clear cache
******************************/
gulp.task('clear', function () {
  return cache.clearAll();
});

/* Copy
******************************/
gulp.task('copy', function () {
  return gulp.src([
    './source/fonts/**/*.{woff,woff2}',
    './source/js/*.js'
  ], {
    base: './source'
  })
    .pipe(gulp.dest('./build'));
});

/* Clean
******************************/
gulp.task('clean', function() {
  return del('./build');
});

/* Build
******************************/
gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('copy', 'images'),
  gulp.parallel('webp', 'sprite:svg'),
  gulp.parallel('styles', 'scripts', 'html')
  )
);

/* Default
******************************/
gulp.task('default', gulp.series(
  'build',
  gulp.parallel('watch', 'serve')
));
