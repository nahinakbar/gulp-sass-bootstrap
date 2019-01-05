'use strict';

let gulp = require('gulp');
let postcss = require('gulp-postcss');
let autoprefixer = require('autoprefixer');
let cleanCSS = require('gulp-clean-css');
let sass = require('gulp-sass');
let rename = require('gulp-rename');
let merge = require('merge-stream');
let sourcemaps = require('gulp-sourcemaps');
let browserSync = require('browser-sync').create();

let config = {
    paths: {
        src:  './src'
    }
};

// import fontawesome 5
gulp.task('fa-import', function () {
  let faFonts = gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest(config.paths.src + '/assets/fonts'));
  let faAllCss = gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
    .pipe(gulp.dest(config.paths.src + '/assets/css/'));

  return merge(faFonts, faAllCss);
})

// import popperjs, jquery and bootstrap scripts
gulp.task('js-import', function () {
  let bootstrapJs = gulp.src('node_modules/bootstrap/dist/js/bootstrap.min.js')
    .pipe(gulp.dest(config.paths.src + '/assets/js/vendor/'));
  let popperJs = gulp.src('node_modules/popper.js/dist/popper.min.js')
    .pipe(gulp.dest(config.paths.src + '/assets/js/vendor/'));
  let jQuery = gulp.src('node_modules/jquery/dist/jquery.min.js')
    .pipe(gulp.dest(config.paths.src + '/assets/js/vendor/'));

  return merge(bootstrapJs, popperJs, jQuery);
})

// CSS
gulp.task('sass', function () {
    return gulp.src(config.paths.src + '/assets/sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([ autoprefixer({ browsers: [
          'Chrome >= 35',
          'Firefox >= 38',
          'Edge >= 12',
          'Explorer >= 10',
          'iOS >= 8',
          'Safari >= 8',
          'Android 2.3',
          'Android >= 4',
          'Opera >= 12']})]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.paths.src + '/assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(config.paths.src + '/assets/css'));
});

gulp.task('sass:watch', function (done) {
    gulp.watch(config.paths.src + '/assets/sass/**/*.scss', gulp.series('sass'));
    done();
});

gulp.task('files:watch', function (done) {
    gulp.watch(config.paths.src + '/*.html').on('change', browserSync.reload);
    done();
});

// Live-reload
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: config.paths.src
        },
    });
});

gulp.task('watch',
            gulp.parallel('sass:watch', 'files:watch'));

gulp.task('serve',
            gulp.series('sass',
            gulp.parallel('watch', 'browserSync')));

gulp.task('default',
            gulp.series('serve'));

