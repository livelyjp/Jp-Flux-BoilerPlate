
var gulp = require('gulp');
var bower = require('gulp-bower');
var notify = require('gulp-notify');
var watch = require('gulp-watch');
var eslint = require('gulp-eslint');
var gStreamify = require('gulp-streamify');
var cached = require('gulp-cached');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var envify = require('envify');
var del = require('del');

var scriptsDir = './Scripts/Application';
var releaseDir = './Scripts/release';
var entryPoints = [scriptsDir + '/Application.jsx'];
var releaseBundleFileName = 'bundle.js';

var jsLintDir = scriptsDir + '/**/*.js';
var jsxLintDir = scriptsDir + '/**/*.jsx';

var isProduction = false;

gulp.task('start', function (callback) {
    runSequence('check-environment', 'clean-release-dir', 'install-bower-components', ['watch-and-bundle-jsx-js-scripts', 'watch-and-lint-jsx-js-scripts'], callback);
});

gulp.task('check-environment', function() {
    return console.log('Is Environment Production: ' + isProduction);
});

gulp.task('install-bower-components', function () {
    return bower({ layout: "byComponent" });
});

gulp.task('clean-release-dir', function () {
    console.log("Cleaning Dir: " + releaseDir);
    return del([releaseDir]);
});

gulp.task('bundle-jsx-js-scripts', ['clean-release-dir'], function () {
    return bundleScripts(false);
});

gulp.task('watch-and-bundle-jsx-js-scripts', ['clean-release-dir'], function () {
    return bundleScripts(true);
});

gulp.task('lint-jsx-js-scripts', function () {
    return lintScripts();
});

gulp.task('watch-and-lint-jsx-js-scripts', function () {
    gulp.watch([jsLintDir, jsxLintDir], ['lint-jsx-js-scripts']);
});

function bundleScripts(watch) {
    console.log("Entry Files: " + entryPoints);

    var bundler = browserify({
        debug: !isProduction,
        entries: entryPoints,
        cache: {},
        packageCache: {},
        fullPaths: watch,
        extensions: ['.jsx']
    });
    if (watch) {
        bundler = watchify(bundler);
    }
    addTransformsToBundler(bundler);

    function rebundle() {
        console.log("Rebundling");
        var stream = bundler.bundle();
        stream.on('error', handleError("Browserify"));
        stream = stream.pipe(source(releaseBundleFileName));
        if (isProduction) {
            stream.pipe(gStreamify(uglify({mangle: false})));
        }
        return stream.pipe(gulp.dest(releaseDir));
    }

    bundler.on('update', rebundle);
    return rebundle();
}

function addTransformsToBundler(bundler) {
    bundler.transform(reactify);
    bundler.transform({ global: true }, envify);
}

function lintScripts() {
    console.log("Linting files");
    return gulp.src([jsLintDir, jsxLintDir])
        .pipe(cached('Linting')) //Comment Out To See All Errors
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

function handleError(task) {
    return function (err) {
        gutil.log(gutil.colors.red(err));
        notify.onError(task + ' failed, check the logs...')(err);
    };
}

gulp.task('default', ['start']);
