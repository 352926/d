var gulp = require('gulp'),
    concat = require('gulp-concat'),
    del = require('del'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    header = require('gulp-header');

gulp.task('clean', function (cb) {
    del(['asset/css', 'asset/js'], cb);
});

var get_time = function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    return year + '-' + month + '-' + strDate + ' ' + hour + ':' + minute + ':' + second;
};
var pkg = require('./package.json');
var banner = [
    '/*! ',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * \@version v<%= pkg.version %>',
    ' * \@copyright <%= pkg.author %> ',
    ' * \@modified time ' + get_time() + '',
    ' * https://github.com/352926/d',
    ' * https://ding.uq0.com/d/demo.html',
    ' */'
].join('\n');
gulp.task('css_min', function () {
    gulp.src(['src/*.css'])
        .pipe(header(banner, {pkg: pkg}))
        .pipe(minifycss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/'));
});
gulp.task('js_min', function () {
    gulp.src(['src/*.js'])
        .pipe(uglify())
        .pipe(header(banner, {pkg: pkg}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['clean'], function () {
    gulp.start(['css_min', 'js_min']);
});

gulp.task('clean', function (cb) {
    del(['./dist'], cb);
});

let watch_dir = 'src/*';

gulp.task('watch', function () {
    gulp.watch(watch_dir, function (e) {
        gulp.src(watch_dir)
            .pipe(connect.reload());
        gulp.start(['css_min', 'js_min']);
        //console.log('reload finished');
    });
});
