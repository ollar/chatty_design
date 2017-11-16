var gulp = require('gulp');
var hb = require('gulp-hb');
var del = require('del');
var sass = require('gulp-sass');
var path = require('path');
var cache = require('gulp-cached');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var rename = require("gulp-rename");
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var gulpif = require('gulp-if');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');

var env = 'dev';

gulp.task(function copy() {
  return gulp.src([
    'src/scripts/*.js',
  ])
    .pipe(uglify())
    .pipe(gulp.dest('public/scripts'))
    .pipe(browserSync.stream());
});


gulp.task(function browser_sync(done) {
    browserSync.init({
      server: './public',
    });

    done();
});


gulp.task(function templates() {
  return gulp.src('src/templates/*.hbs')
    .pipe(plumber())
    .pipe(hb({
      partials: './src/templates/partials/**/*.hbs',
      helpers: './src/templates/helpers/*.js',
      data: './src/templates/data/**/*.{js,json}'
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulpif(env === 'prod', htmlmin({collapseWhitespace: true, removeComments: true})))
    .pipe(gulp.dest('public'))
    .pipe(browserSync.stream());
});


gulp.task(function styles() {
  return gulp.src('src/styles/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(gulpif(env === 'dev', sass(), sass({
      outputStyle: 'compressed',
    })))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulpif(env === 'dev', sourcemaps.write('../maps')))
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream());
});


gulp.task(function clean(done) {
  cache.caches = {};
  return del(path.join('public', '/*'), {force: true}, done);
});

gulp.task('default',
  gulp.series('clean', 'browser_sync',
    gulp.parallel('templates', 'styles', 'copy',
      function bindWatchers(done) {
        gulp.watch('src/styles/**', gulp.series('styles'));
        gulp.watch('src/templates/**', gulp.series('templates'));
        gulp.watch('src/scripts/*', gulp.series('copy'));
      }
    )
  )
);

gulp.task(function prod(prodDone) {
  env = 'prod';
  return gulp.series('clean',
    gulp.parallel('templates', 'styles', 'copy'),
  done => done(prodDone()))();
});
