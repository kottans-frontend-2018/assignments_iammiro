const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const imagemin = require('gulp-imagemin');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const concatCss = require('gulp-concat-css');
const babel = require('gulp-babel');
const ghPages = require('gulp-gh-pages');

gulp.task('deploy', function() {
  return gulp.src('./build/**/*')
    .pipe(ghPages());
});

gulp.task('serve', ['sass', 'pug', 'min-js', 'compress-images', 'fonts', 'html'], () => {
  browserSync.init({
    server: {
      baseDir: "./build/"
    }
  });

  gulp.watch('src/**/*.sass', ['sass']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/fonts/*.*', ['fonts']);
  gulp.watch('src/**/*.js', ['min-js']);
  gulp.watch('src/**/*.pug', ['pug']);
  gulp.watch('build/*.*').on('change', browserSync.reload);
});

gulp.task('compress-images', () => {
  gulp.src('src/img/**/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/img'))
});

gulp.task('min-js', () => {
  gulp.src('src/block/**/*.js')
    .pipe(concat('main.js'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('build/js/'))
    .pipe(browserSync.stream());
});

// gulp.task('min-css', () => {
//   return gulp.src('src/sass/*.css')
//     .pipe(concatCss("index.css"))
//     .pipe(cleanCSS({compatibility: 'ie8'}))
//     .pipe(gulp.dest('build/sass/'));
// });

gulp.task('fonts', () => {
  return gulp.src([
    'src/fonts/**.*'])
    .pipe(gulp.dest('build/fonts/'));
});

gulp.task('html', () => {
  return gulp.src([
    'src/**.html'])
    .pipe(gulp.dest('build/'));
});

gulp.task('sass', () => {
  return gulp.src('src/sass/index.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(concat('index.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream());
});

gulp.task('pug', () => {
  return gulp.src('src/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('build/'))
    .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);