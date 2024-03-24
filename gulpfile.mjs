import sassCompiler from 'sass'; // Импортируем компилятор Sass
import gulpSass from 'gulp-sass';
const sass = gulpSass(sassCompiler);
import gulp from 'gulp';
import browserSync from 'browser-sync';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';


function server(done) {
    browserSync.init({
        server: {
            baseDir: "src"
        }
    });

    gulp.watch("src/*.html").on('change', browserSync.reload);
    done();
}

function styles() {
    return gulp.src("src/sass/**/*.+(scss|sass)")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions', '> 5%'],
            cascade: false
        }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
}

function watch() {
    gulp.watch("src/sass/**/*.+(scss|sass)", styles);
}

gulp.task('server', server);
gulp.task('styles', styles);
gulp.task('watch', watch);
gulp.task('default', gulp.parallel(watch, server, styles));