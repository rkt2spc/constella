var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')();

//***************************************************
// IMAGES
//***************************************************
var imgSrc = './public/src/images/**/*.{gif,jpeg,jpg,png,svg,ico}',
    imgDst = './public/build/images';

gulp.task('build-img', function() {
    gulp.src(imgSrc)
        .pipe(plugins.changed(imgDst))
        .pipe(plugins.imagemin())
        .pipe(gulp.dest(imgDst));
});

gulp.task('debug-build-img', function() {
    gulp.src(imgSrc)
        .pipe(plugins.changed(imgDst))
        .pipe(gulp.dest(imgDst));
});

//***************************************************
// HTML
//***************************************************
var htmlSrc = './public/src/**/*.{htm,html}',
    htmlDst = './public/build';

gulp.task('build-html', function() {
    gulp.src(htmlSrc)
        .pipe(plugins.changed(htmlDst))
        .pipe(plugins.minifyHtml())
        .pipe(gulp.dest(htmlDst));
});

gulp.task('debug-build-html', function() {
    gulp.src(htmlSrc)
        .pipe(plugins.changed(htmlDst))
        .pipe(gulp.dest(htmlDst));
});

//***************************************************
// JAVASCRIPT
//***************************************************
var jsSrc = './public/src/js/**/*.js',
    jsDst = './public/build/js';

gulp.task('build-js', function() {
    gulp.src(jsSrc)
        .pipe(plugins.concat('app.js'))
        .pipe(plugins.stripDebug())
        .pipe(plugins.uglify())
        .pipe(gulp.dest(jsDst));
});

gulp.task('debug-build-js' , ['check-js'], function() {
    gulp.src(jsSrc)
        .pipe(plugins.concat('app.js'))
        .pipe(gulp.dest(jsDst));
});

//***************************************************
// CSS
//***************************************************
var cssSrc = './public/src/css/**/*.css',
    cssDst = './public/build/css';

gulp.task('build-css', function() {
    gulp.src(cssSrc)
        .pipe(plugins.concat('app.css'))
        .pipe(plugins.autoprefixer('last 2 versions'))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(cssDst));
});

gulp.task('debug-build-css', function() {
    gulp.src(cssSrc)
        .pipe(plugins.concat('app.css'))
        .pipe(plugins.autoprefixer('last 2 versions'))
        .pipe(gulp.dest(cssDst));
});

//***************************************************
// MISCS
//***************************************************
var jsonSrc = './public/src/data/**/*.json', jsonDst = './public/build/data',
    fontSrc = './public/src/fonts/**/*.{ttf,otf}', fontDst = './public/build/fonts';

gulp.task('build-miscs', function() {
    
    gulp.src(jsonSrc)
        .pipe(plugins.jsonnminify())
        .pipe(gulp.dest(jsonDst));

    gulp.src(fontSrc)
        .pipe(gulp.dest(fontDst));
});

gulp.task('debug-build-miscs', ['check-json'], function() {

    gulp.src(jsonSrc)
        .pipe(gulp.dest(jsonDst));

    gulp.src(fontSrc)
        .pipe(gulp.dest(fontDst));
});

//***************************************************
// LINT & HINT
//***************************************************
gulp.task('check-json', function() {
    gulp.src(jsonSrc)
        .pipe(plugins.jsonlint())
        .pipe(plugins.jsonlint.reporter());
        // .pipe(plugins.jsonlint.failAfterError());
});

gulp.task('check-js', function() {
    gulp.src(jsSrc)
        .pipe(plugins.jshint({esversion: 6}))
        .pipe(plugins.jshint.reporter('default'));
        // .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('check', ['check-json', 'check-js']);

//***************************************************
// BUILD
//***************************************************
gulp.task('build',                  ['build-img', 'build-html', 'build-js', 'build-css']);
gulp.task('debug-build',            ['debug-build-img', 'debug-build-html', 'debug-build-js', 'debug-build-css']);

gulp.task('clean-build',            ['clean'],  () => gulp.start('build'));
gulp.task('clean-debug-build',      ['clean'],  () => gulp.start('debug-build'));


//***************************************************
// CLEAN
//***************************************************
var cleanSrc = './public/build';

gulp.task('clean', function(done) {
    return gulp.src(cleanSrc)
        .pipe(plugins.clean({read: false}));
});

//***************************************************
// WATCH
//***************************************************
gulp.task('watch', function() {
    gulp.watch(imgSrc,  ['build-img']);
    gulp.watch(htmlSrc, ['build-html']);
    gulp.watch(jsSrc,   ['build-js']);
    gulp.watch(cssSrc,  ['build-css']);
});

gulp.task('debug-watch', function() {
    gulp.watch(imgSrc,  ['debug-build-img']);
    gulp.watch(htmlSrc, ['debug-build-html']);
    gulp.watch(jsSrc,   ['debug-build-js']);
    gulp.watch(cssSrc,  ['debug-build-css']);
});

//***************************************************
// NODEMON
//***************************************************
gulp.task('nodemon', ['clean-debug-build', 'debug-watch'], function() {

    var nodemon = plugins.nodemon({
        script: 'index.js',
        watch: ['.'],
        ignore: ['./public', 'gulpfile.js'],
        ext: 'js',
        env: { 'NODE_ENV': 'development' }
    });

    nodemon.on('crash', function() {
        var delay = 3;
        nodemon.emit('restart', delay);
    });

    return nodemon;
});

//***************************************************
// DEFAULT
//***************************************************
gulp.task('default',    ['build', 'watch']);
gulp.task('debug',      ['debug-build', 'debug-watch']);

