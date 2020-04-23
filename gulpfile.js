var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
const sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('scripts', function () {
  return gulp.src(['src/app/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('src/dist/scripts/'))
    .pipe(notify({ message: 'JS files successfully concated and reduced' }));
});

gulp.task('jshint', function () {
  return gulp.src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});



gulp.task('styles', () => {
  return gulp.src('src/assets/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/dist/styles/'))
});

gulp.task('watch', function () {
  // Watch .scss files
  gulp.watch('src/assets/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('src/**/*.js', ['scripts']);
});
