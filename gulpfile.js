var gulp = require('gulp');
var hb = require('gulp-hb');
var del = require('del');
var sass = require('gulp-sass');
var path = require('path');
var cache = require('gulp-cached');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var rename = require("gulp-rename");


gulp.task(function templates() {
  return gulp.src('src/templates/*.hbs')
    .pipe(cache('templates'))
    .pipe(plumber())
    .pipe(hb({
      partials: './src/templates/partials/**/*.hbs',
      helpers: './src/templates/helpers/*.js',
      data: './src/templates/data/**/*.{js,json}'
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('public'));
});


gulp.task(function styles() {
  return gulp.src('src/styles/**/*.scss')
    .pipe(cache('styles'))
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('public/css'));
});


gulp.task(function clean(done) {
  cache.caches = {};
  return del(path.join('public', '/*'), {force: true}, done);
});

gulp.task('default',
  gulp.series('clean',
    gulp.parallel('templates', 'styles',
      function bindWatchers(done) {
        gulp.watch('src/styles/**', gulp.series('styles'));
        gulp.watch('src/templates/**', gulp.series('templates'));
      }
    )
  )
);
