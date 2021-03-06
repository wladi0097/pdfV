var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var js = [
  './js/pdf.js',
  './js/pdfV.js',
  './js/_buildElement.js',
  './js/_animation.js',
  './js/_pdfViewerElement_variables.js',
  './js/_pdfViewerElement_events.js',
  './js/_pdfViewerElement_validation.js',
  './js/_pdfViewerElement_builder.js',
  './js/_pdfViewerElement_navigator.js',
  './js/_pdfViewerElement.js',
];

gulp.task('js', function() {
  return gulp.src(js)
    .pipe(concat('pdfV.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/'));
});

gulp.task('worker', function() {
  return gulp.src('./js/Pdf.worker.js')
    .pipe(uglify())
    .pipe(gulp.dest('./build/'));
});

gulp.task('default', ['js', 'worker']);
