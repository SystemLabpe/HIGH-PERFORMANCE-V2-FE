'use strict';

var gulp = require('gulp'),
connect = require('gulp-connect'),
jshint = require('gulp-jshint'),
historyApiFallback = require('connect-history-api-fallback');

gulp.task('server', function() {
  connect.server({
    root: './app',
    hostname: '0.0.0.0',
    port: 8081,
    livereload: true,
    middleware: function(connect, opt) {
      return [ historyApiFallback ];
    }
  });
});

gulp.task('jshint', function() {
  return gulp.src(['./app/modules/*.js'],
    ['./app/modules/**/*.js'],
    ['./app/modules/**/**/*.js'])
  .pipe(jshint('.jshintrc'))
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jshint.reporter('fail'))
  .pipe(connect.reload());
});

gulp.task('css', function() {
  gulp.src('./app/css/*.css')
  .pipe(connect.reload());
});

gulp.task('html', function() {
  gulp.src('./app/**/*.html')
  .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(['./app/**/*.html'], ['html']);
  gulp.watch(['./app/css/**/*.css'], ['css']);
  gulp.watch(['./app/modules/**/*.js', './app/modules/**/**/*.js',
    './Gulpfile.js'], ['jshint']);
});

gulp.task('default', ['server', 'watch']);
