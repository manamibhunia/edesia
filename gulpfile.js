var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    prefix = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    clean = require('gulp-clean'),
    hbsfy = require('hbsfy');

hbsfy.configure({
    extensions: ['hbs']
});

gulp.task('lint-client', function() {
    return gulp.src('./src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('clean-scripts', function() {
    return gulp.src(['dist/**/*.js'], {
            read: false
        })
        .pipe(clean());
});

gulp.task('clean-styles', function() {
    return gulp.src(['dist/styles/*.css'], {
            read: false
        })
        .pipe(clean());
});

gulp.task('icons', function() {
    return gulp.src(['./node_modules/bootstrap/fonts/**.*', './node_modules/font-awesome/fonts/**.*'])
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('browserify', ['lint-client', 'clean-scripts'], function() {
    gulp.src('src/js/main.js')
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(browserify({
            transform: [hbsfy]
        }))
        .pipe(uglify({
            compress: {
                negate_iife: false
            }
        }))
        .pipe(rename('cmpe226.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('styles', ['clean-styles'], function() {
    return gulp.src('src/styles/main.css')
        .pipe(prefix({
            cascade: true
        }))
        .pipe(rename('cmpe226.css'))
        .pipe(gulp.dest('src/styles/'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('minify', ['styles'], function() {
    return gulp.src('src/styles/cmpe226.css')
        .pipe(minifyCSS())
        .pipe(rename('cmpe226.min.css'))
        .pipe(gulp.dest('dist/styles/'));
});

gulp.task('copy-html', function() {
    gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('copy-images', function() {
    gulp.src('src/images/*')
        .pipe(gulp.dest('dist/images/'));
});

gulp.task('copy-css', function() {
    gulp.src(['node_modules/bootstrap/dist/css/bootstrap.min.css', 
        'node_modules/font-awesome/css/font-awesome.min.css'])
        .pipe(gulp.dest('dist/styles/'));
});

gulp.task('build', ['browserify', 'minify', 'icons', 'copy-html', 'copy-images', 'copy-css']);


gulp.task('watch', ['build'], function() {
    gulp.watch('src/**/*.*', ['build']);
});

// Static Server + watching scss/html files
// gulp.task('serve', ['build'], function() {

//     browserSync({
//         server: {
//             baseDir: "./dist"
//         }
//     });

//     gulp.watch('src/**/*.*', ['build']);
// });

gulp.task('default', ['watch']);