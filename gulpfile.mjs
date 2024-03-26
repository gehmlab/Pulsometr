import sassCompiler from 'sass'; // Импортируем компилятор Sass
import gulpSass from 'gulp-sass';
const sass = gulpSass(sassCompiler);
import gulp from 'gulp';
const { parallel } = gulp;
import browserSync from 'browser-sync';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import imagemin from 'gulp-imagemin';
import htmlmin from 'gulp-htmlmin';


function server(done) {
    browserSync.init({
        server: {
            baseDir: "dist"
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
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
}

function watch() {
    gulp.watch("src/sass/**/*.+(scss|sass|css)", styles);
    gulp.watch("src/*.html").on('change', parallel('html'));
};

gulp.task('html', function() {
    return gulp.src("src/*html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('scripts', function() {
    return gulp.src("src/js/**/*.js")
        .pipe(gulp.dest('dist/js'));
});

gulp.task('fonts', function() {
    return gulp.src("src/fonts/**/*")
        .pipe(gulp.dest('dist/fonts'));
});


gulp.task('icons', function() {
    return gulp.src("src/icons/**/*")
        .pipe(gulp.dest('dist/icons'));
});

gulp.task('mailer', function() {
    return gulp.src("src/mailer/**/*")
        .pipe(gulp.dest('dist/mailer'));
});

gulp.task('images', function() {
    return gulp.src("src/img/**/*")
    .pipe(imagemin())  
    .pipe(gulp.dest('dist/img'));
});


gulp.task('server', server);
gulp.task('styles', styles);
gulp.task('watch', watch);

gulp.task('default', gulp.parallel('watch', 'server', 'styles', 'html', 'scripts', 'fonts', 'icons', 'mailer', 'images'));