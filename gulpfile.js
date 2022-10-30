const { src, dest, watch , series, parallel, task } = require('gulp');
const autoprefixer = require('autoprefixer'); // Diseño para todos los navegadores 
const sass = require('gulp-sass') (require ('sass')); // Pre-procesador css
const browserSync = require('browser-sync'); // sincronizar navegador( ejem: mobile)
const postcss = require('gulp-postcss'); // Herramienta para hacer modificaciones al css
const cssnano = require('cssnano'); // minifica el css
const sourcemaps = require('gulp-sourcemaps'); // Permite visualizar el código en el navegador, aunque este se encuentre minificado
const purgecss = require('gulp-purgecss') // Elimina css que no se usa en el html

const path = {
    scss: './scss/**/*.scss', // './scss/**/*.scss'
    css: './css', // './css'
    js: 'src/js/**/*.js',
    imagenes: 'src/img/**/*'
}
function server() {
    browserSync.init({
        server: './'
    });
    // watch(path.scss, ['css']);
    watch('./*.html').on('change', browserSync.reload);

}

function css() {
    return src(path.scss)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        // .pipe(autoPrefixer({
        //     versions: ['last 2 browsers']
        // }))
        .pipe(postcss([autoprefixer({
            versions: ['last 2 browsers']
        }), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(path.css))
        .pipe(browserSync.stream());
}
function javascript() {
    return src(path.js)
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
}

function purge() {
    return src('./css/app.css')
        .pipe(purgecss({
            content: ['./*.html']
        }))
        .pipe(dest('./css/'))
}

function imagenes() {
    return src(path.imagenes)
        .pipe(cache(imagemin({ optimizationLevel: 3})))
        .pipe(dest('public/build/img'))
        .pipe(notify({ message: 'Imagen Completada'}));
}

function watchFiles() {
    watch(path.scss, css);
    // watch( path.js, javascript );
    // watch( path.imagenes, imagenes );
    // watch( path.imagenes, versionWebp );
}

exports.purge = purge;
// exports.css = css;
// exports.watchFiles = watchFiles

exports.default = parallel(css, server, watchFiles);