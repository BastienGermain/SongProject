var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    plumber = require('gulp-plumber'),
    sync = require('browser-sync').create(),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer');


gulp.task('html', function() {
    gulp.src('app/*.html')
        // .pipe(gulp.dest('dist/'))
        .pipe(sync.stream());
});

// gulp.task('img', function() {
//     gulp.src('app/img')
//         .pipe(gulp.dest('dist/assets/images'))
//         .pipe(sync.stream());
// });

gulp.task('stylus', function() {
    return gulp.src('stylus/style.styl')
        .pipe(plumber())
        .pipe(stylus())
        .pipe(gulp.dest('css/'));
});

gulp.task('css', ['stylus'], function() {

    return gulp.src('css/*.css')
        .pipe(postcss([ autoprefixer() ]))
        .pipe(sync.stream())
        .pipe(gulp.dest('css/'));
});

gulp.task('javascript', function() {
    return gulp.src('js/*.js')
        // .pipe(concat('script.js'))
        // .pipe(uglify())
        // .pipe(gulp.dest('dist/assets/js/'))
        // .pipe(gulp.dest('D:/www/wordpress_ca/wp-content/themes/ca/assets/js/'))
        .pipe(sync.stream());
});

gulp.task('watch', function() {
  gulp.watch(['app/stylus/**/*.styl'], ['css']);
  gulp.watch(['app/*.html'], ['html']);
  gulp.watch(['app/js/*.js'], ['javascript']);
});

gulp.task('sync', ['html', 'stylus', 'css', 'javascript', 'watch'], function() {
    sync.init({
        server: __dirname //+ '/dist'
    });
});

gulp.task('default', ['sync'], function() {});
