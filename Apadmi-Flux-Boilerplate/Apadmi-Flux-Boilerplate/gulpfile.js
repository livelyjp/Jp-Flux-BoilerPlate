
var del = require('del');
var gulp = require('gulp');
var bower = require('gulp-bower');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var notify = require('gulp-notify');
var gutil = require('gulp-util');

var tasks = [];
var scriptsDir = './Scripts';
var entryFileName = "Components/Application.jsx";
var releaseDir = scriptsDir + '/release';
var releaseBundleFileName = 'bundle.js';

/*
 *
 * Project setup Tasks
 *
 */

//This task sets up all the required bower components and does the initial JSX build, bundle and watch
gulp.task('setup-gulp', function (callback) {
    runSequence('clean-release', 'get-bower-npm-components', 'startWatch', callback);
});

//Import all required bower packages
gulp.task('get-bower-npm-components', function () {
    return bower({ layout: "byComponent" });
});

/*
 *
 * Project Build and Clean Tasks
 *
 */

//Deletes Release Folder
gulp.task('clean-release', function (callback) {
    del([scriptsDir + '/release/'], callback);
});

/*
 *
 * JSX Development Tasks
 *
 */

gulp.task('initialBuild', ['clean-release'], function() {
    return bundleFiles(entryFileName, false);
});

gulp.task('startWatch', ['initialBuild'], function() {
    return bundleFiles(entryFileName, true);
});

function bundleFiles(file, watch) {
    var entryFile = scriptsDir + '/' + file;
    console.log("Entry File: " + entryFile);
    var props = {entries: [entryFile], debug: true, cache: {}, packageCache: {}, extensions: ['.jsx']};
    //var props = {entries: [entryFile], debug: true, cache: {}, packageCache: {}, insertGlobals: true, extensions: ['.jsx']};
    var bundler = watch ? watchify(browserify(props)) : browserify(props);

    bundler.on('update', function(){
        gutil.log('Rebundling From Update...');
        rebundle(bundler);
        gutil.log('Rebundling Complete');
    });
    return rebundle(bundler);
}

function rebundle(bundler) {
    gutil.log('Starting To Compile React Components');
    bundler.transform(reactify);
    gutil.log('React Compilation Complete');

    var stream = bundler.bundle();
    return stream.on('error', handleErrors)
        .pipe(source(releaseBundleFileName))
        .pipe(gulp.dest(releaseDir));
}

function handleErrors() {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>"
    }).apply(this, args);
    this.emit('end'); // Keep gulp from hanging on this task
}

gulp.task('default', tasks);