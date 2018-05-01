const gulp = require('gulp'),
  pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    imgMin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    maps = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber')
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    pxtorem = require('postcss-pxtorem'),
    del = require('del'),
    babel = require('gulp-babel'),
    run = require('run-sequence'),
    uglify = require('gulp-uglify'),
    csso = require('gulp-csso'),
    concat = require('gulp-concat');


gulp.task('sass', () => {
  const plugins = [
    pxtorem({rootValue: 16, propList: ['*']}),
    autoprefixer({browsers: ['last 100 versions']})
  ];
  return gulp.src('./src/scss/**/*.scss')
  .pipe(maps.init())
  .pipe(sass())
  .pipe(postcss(plugins))
  .pipe(csso())
  .pipe(maps.write('.'))
  .pipe(gulp.dest('./src/tmp/css/'))
  .pipe(browserSync.stream())
});

gulp.task('pug', () => {
  return gulp.src('./src/pug/*.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('./src/tmp/'))
  .pipe(browserSync.stream())
});


gulp.task('images', () => {
  return gulp.src('./src/img/*')
  .pipe(imgMin())
  .pipe(gulp.dest('./src/tmp/img/'))
});

gulp.task('serve', ['sass','concat', 'pug'], () => {
  browserSync.init({
    server: './src/tmp'
  });
  gulp.watch('./src/pug/**/*.pug', ['pug']);
  gulp.watch('./src/scss/**/*.scss', ['sass']);
  gulp.watch('./src/js/es6/*.js', ['concat']);
});


gulp.task('babel', ()=>{
    return gulp.src('./src/js/es6/*.js')
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulp.dest('./src/js/es5/'))
});

gulp.task('concat', ['babel'], () => {
  return gulp.src(['./src/js/scripts.js'])
  .pipe(concat('all.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./src/tmp/js/'))
});

gulp.task('clean', () => {
  del(['dist', './src/tmp']);
});

gulp.task('run', ['clean'], (callback) => {
  run('images', 'sass', 'concat', 'pug', callback);
})
gulp.task('build', ['run'], () => {

  return gulp.src('./src/tmp/**/*', {base: './src/tmp'})
  .pipe(gulp.dest('dist'));
});

gulp.task('default', ['run'], () => {
  gulp.start('serve');
});