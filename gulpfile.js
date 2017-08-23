var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('js', function() {
  return gulp.src('./js/*.js')
    .pipe(concat('pdfV.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/'));
});

gulp.task('worker', function() {
  return gulp.src('./js/worker/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./build/'));
})

gulp.task('default', ['js','worker'])
