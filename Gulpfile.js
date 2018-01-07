const gulp = require('gulp'),
      config = require('./gulpConfig'),
      sass = require('gulp-sass'),
      plumber = require('gulp-plumber');

gulp.task('sass', () => {
  return gulp.src(config.src.scss)
  .pipe(plumber())
  .pipe(sass())
  .pipe(plumber.stop())
  .pipe(gulp.dest(config.dest.css))
});

gulp.task('serve', () => {
  gulp.watch('./src/scss/styles.scss/**/*.scss', ['sass']);
});

gulp.task('default', () => {
  console.log('Gulp is setup')
})