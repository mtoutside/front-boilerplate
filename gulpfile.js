const gulp = require('gulp'),
  sass = require('gulp-sass')(require('sass')),
  ejs = require('gulp-ejs'),
  rename = require('gulp-rename'),
  autoprefixer = require('gulp-autoprefixer'),
  cssmin = require('gulp-clean-css'),
  plumber = require('gulp-plumber'),
  minimist = require('minimist'),
  deleteEmpty = require('delete-empty'),
  del = require('del'),
  notify = require('gulp-notify');

const argv = minimist(process.argv.slice(2));
const ROOT = __dirname;
const ENV = argv.env || 'dev';
const CONTENTS_PATH = ''; // dist先ディレクトリを調整する（例: 'sample/'）
const SRC = `${ROOT}/src/`;
const DEST = `${ROOT}/dist/${CONTENTS_PATH}`;
const SERVER_DIR = `${ROOT}/dist/`;
console.log('argv.env: ', argv.env);
console.log('ENV: ', ENV);

const paths = {
  src: `${SRC}`,
  dest: `${DEST}`,
  styles: {
    src: `${SRC}assets/css/**/*.scss`,
    css: `${DEST}assets/css/style.css`,
    dest: `${DEST}`,
  },
  ejspath: {
    src: `${SRC}**/*.ejs`,
    exclude: `${SRC}**/_*.ejs`,
    dest: `${DEST}`,
  },
  images: {
    src: `${SRC}assets/images/**/*`,
    dir: `${SRC}assets/images/`,
    dest: `${DEST}assets/images/`,
  },
  movies: {
    src: `${SRC}assets/movies/**/*`,
    dir: `${SRC}assets/movies/`,
    dest: `${DEST}assets/movies/`,
  },
};

const settings = {
  clean: {
    patterns: [`${DEST}assets/`],
    options: {},
  },
  cleanDirectory: {
    path: `${DEST}`,
  },
};
const constants = {
  dev: {
    url: 'http://localhost:3000/',
    contentsPath: `/`,
    assetsPath: `/assets/`,
    gaTag: ``,
  },
  stag: {
    url: 'https://design.fdev.jp/',
    contentsPath: `/`,
    assetsPath: `/assets/`,
    gaTag: ``,
  },
  prod: {
    url: 'https://example.jp/',
    contentsPath: `/`,
    assetsPath: ``,
    gaTag: ``,
  },
};

const sassOptions = {
  functions: {
    'env()': () => sass.compiler.types.String(ENV),
    'constants($key)': _key => {
      const key = _key.getValue();
      const value = constants[ENV][key];

      switch (typeof value) {
        case 'number':
          return sass.compiler.types.Number(value);
        case 'boolean':
          return sass.compiler.types.Boolean(value);
        default:
          return sass.compiler.types.String(value);
      }
    },
  },
};

// ejs
function buildejs() {
  const path = [paths.ejspath.src, '!' + paths.ejspath.exclude];
  return gulp
    .src(path)
    .pipe(
      ejs({
        root_path: `${ROOT}/`,
        env: ENV,
        constants: constants[ENV],
      })
    )
    .pipe(
      rename(path => {
        path.extname = '.html';
      })
    )
    .pipe(gulp.dest(paths.ejspath.dest));
}

// sass
function buildsass() {
  return gulp
    .src(paths.styles.src, { base: './src' })
    .pipe(
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>'),
      })
    )
    .pipe(sass(sassOptions))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(gulp.dest(paths.styles.dest));
}

// clean
function clean(cb) {
  del.sync(settings.clean.patterns, settings.clean.options);
  deleteEmpty.sync(settings.cleanDirectory.path);
  cb();
}
// copy
function copy() {
  const path = [paths.images.src, paths.movies.src];
  return gulp
    .src(path, { base: './src' })
    .pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
    .pipe(gulp.dest(paths.dest));
}

// minify css
function release() {
  return gulp
    .src(paths.styles.css, { base: './dist' })
    .pipe(cssmin())
    .pipe(gulp.dest(paths.styles.dest));
}

exports.watch = watch;
exports.buildejs = buildejs;
exports.buildsass = buildsass;
exports.clean = clean;
exports.copy = copy;
exports.release = release;

// watch
function watch() {
  gulp.watch(paths.styles.src, buildsass);
  gulp.watch(paths.ejspath.src, buildejs);
}

gulp.task('default', watch);
gulp.task('clean', clean);
gulp.task('copy', copy);
gulp.task('release', release);
gulp.task('assetsCopy', gulp.series(clean, copy));
gulp.task('build:ejs', buildejs);
gulp.task('build:sass', buildsass);
gulp.task(
  'build',
  gulp.series('assetsCopy', 'build:ejs', 'build:sass', 'release')
);
