'use strict';

const gulp = require('gulp'),
      debug = require('gulp-debug'),
      plumber = require('gulp-plumber'),
      notify = require('gulp-notify'),
      changed = require('gulp-changed'),
      sourcemaps = require('gulp-sourcemaps'),
      sass = require('gulp-sass'),
      minify = require('gulp-clean-css'),
      autoprefixer = require('gulp-autoprefixer'),
      rename = require('gulp-rename'),
      uglify = require('gulp-uglify'),
      concat = require('gulp-concat'),
      gulpIf = require('gulp-if'),
      posthtml = require('gulp-posthtml'),
      include = require('posthtml-include'),
      htmlmin = require('gulp-htmlmin'),
      imagemin = require('gulp-imagemin'),
      pngquant = require('imagemin-pngquant'),
      mozjpeg = require('imagemin-mozjpeg'),
      webp = require('imagemin-webp'),
      svgstore = require('gulp-svgstore'),
      cache = require('gulp-cache'),
      extReplace = require('gulp-ext-replace'),
      normalizeScss = require('node-normalize-scss'),
      del = require('del'),
      server = require('browser-sync').create();

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

/* Notify error message
 ******************************/
const onError = function (error) {
  notify.onError({
    title: 'Error in ' + error.plugin,
    message: [
      '',
      '----------ERROR MESSAGE START----------',
      error.message,
      '----------ERROR MESSAGE END----------'
    ].join('\n'),
    sound: 'Basso'
  })(error);
  this.emit('end');
};

/* Styles compile
******************************/
gulp.task('styles', function () {
  return gulp.src('./source/scss/main.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(sass({
      includePaths: normalizeScss.includePaths
    }))
    .pipe(autoprefixer({
      browsers: [
        'last 2 version',
        '> 1%',
        'IE 10',
        'Firefox ESR'
      ],
      cascade: false
    }))
    .pipe(rename('style.min.css'))
    .pipe(gulpIf(!isDev, minify()))
    .pipe(gulpIf(isDev, sourcemaps.write()))
    .pipe(gulp.dest('./build/css'))
    .pipe(gulpIf(!isDev, rename('style.css')))
    .pipe(gulpIf(!isDev, gulp.dest('./build/css')));
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
    .pipe(plumber({errorHandler: onError}))
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(concat('script.min.js'))
    .pipe(gulpIf(!isDev, uglify()))
    .pipe(gulpIf(isDev, sourcemaps.write()))
    .pipe(gulp.dest('./build/js'))
    .pipe(gulpIf(!isDev, rename('script.js')))
    .pipe(gulpIf(!isDev, gulp.dest('./build/js')));
});

/* HTML
 ******************************/
gulp.task('html', function () {
  return gulp.src('./source/*.html')
    .pipe(plumber({errorHandler: onError}))
    .pipe(changed('./build/'))
    .pipe(posthtml([
      include()
    ]))
    .pipe(htmlmin({
      collapseWhitespace: false,
      removeComments: false
    }))
    .pipe(debug({title: 'html:', showFiles: true}))
    .pipe(gulp.dest('./build'));
});

/* Images
******************************/
gulp.task('images', function () {
  return gulp.src('./source/img/**/*.{png,jpg,jpeg,svg}')
    .pipe(plumber({errorHandler: onError}))
    .pipe(gulpIf(!isDev, gulp.dest('./build/img')))
    .pipe(cache(imagemin(
      [
      pngquant({
        quality : [0.8, 0.9],
        speed   : 2,
        strip: true
      }),
      mozjpeg({
        progressive : true,
        quality     : 85,
        quantTable  : 2
      }),
      imagemin.svgo({
        plugins: [
          {removeViewBox: false},
          {cleanupIDs: false},
          {removeUselessStrokeAndFill: false},
          {removeEmptyContainers: false}
        ]
      })
    ],{
        verbose: true
      })))
    //.pipe(debug({title: 'optimization images:', showFiles: true}))
    .pipe(gulp.dest('./build/img'));
});

/* WEBP
******************************/
gulp.task('webp', function () {
  return gulp.src('./source/img/**/*.{jpg,jpeg,png}')
    .pipe(imagemin([
      webp({
        quality: 80
      })
    ]))
    .pipe(extReplace('.webp'))
    //.pipe(debug({title: 'converting to webp:', showFiles: true}))
    .pipe(gulp.dest('./build/img'));
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
    .pipe(changed('./build'))
    .pipe(debug({title: 'copy:', showFiles: true}))
    .pipe(gulp.dest('./build'));
});

/* Clean
******************************/
gulp.task('clean', function () {
  return del('./build');
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
  gulp.watch('./source/scss/**/*.scss', gulp.series('styles'));
  gulp.watch('./source/js/parts/**/*.js', gulp.series('scripts'));
  gulp.watch('./source/**/*.html', gulp.series('html'));
  gulp.watch([
    './source/fonts/**/*.{woff,woff2}',
    './source/js/*.js'
  ], gulp.series('copy'));
  gulp.watch('./source/img/**/*.{png,jpg,jpeg,svg}', gulp.parallel('images', 'webp'));
  gulp.watch('./source/img/**/{icon-*,logo-*}.svg', gulp.series('sprite:svg'));
  gulp.watch('./build/**/*.*').on('change', server.reload);
});

/* Build
******************************/
gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('styles', 'scripts', 'copy', 'images', 'webp', 'sprite:svg'),
  'html'
  )
);

/* Default
******************************/
gulp.task('default', gulp.series(
  'build',
  gulp.parallel('watch', 'serve')
));
