/**
 * gulpfile.js
 *
 */
const gulp = require("gulp");

const del = require("del");
const json = require("gulp-json-editor");
const wrap = require("gulp-wrap");
const yaml = require("gulp-yaml");
const babel = require("gulp-babel");
const eslint = require("gulp-eslint");
const changed = require("gulp-changed");
const handlebars = require("gulp-handlebars");
const sourcemaps = require("gulp-sourcemaps");

const { series, parallel } = gulp;

/*!
 * Load plugin configuration files.
 */
const out = "app";

/**
 * Delete previous builds.
 */
const clean = () => del(`${out}/**`);

/**
 * Build javascript
 */
const jsBuild = () =>
  gulp
    .src("src/**/*.js", { base: "src" })
    .pipe(changed(out))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(out));

/**
 * Build configuration files
 */
const ymlBuild = () =>
  gulp
    .src("src/**/*.yml", { base: "src" })
    .pipe(changed(`${out}`))
    .pipe(yaml())
    .pipe(gulp.dest(`${out}`));

/**
 * Build handlebars templates
 */
const hbsBuild = () =>
  gulp
    .src("src/**/*.hbs", { base: "src" })
    .pipe(changed(out))
    .pipe(handlebars())
    .pipe(
      wrap(`const Handlebars = require('handlebars');
    module.exports = Handlebars.template(<%= contents %>);`)
    )
    .pipe(gulp.dest(out));

/**
 * Build package.json
 */
const pkgBuild = () => gulp.src("package.json").pipe(gulp.dest(out));

/**
 * Build configuration files
 */
const cfgBuild = () =>
  gulp
    .src("config/**/*.yml")
    .pipe(changed(`${out}/config`))
    .pipe(yaml())
    .pipe(gulp.dest(`${out}/config`));

/**
 * Build other misc files
 */
const etcBuild = () =>
  gulp.src(["config/**/*.{json,pfx,crt}"]).pipe(gulp.dest(`${out}/config`));

/**
 * Build misc JSON files
 */
const jsonBuild = () => gulp.src(["src/**/*.json"]).pipe(gulp.dest(`${out}`));

/**
 * fileWatch
 */
const fileWatch = () => {
  gulp.watch("src/**/*.js", jsBuild);
  gulp.watch("src/**/*.hbs", hbsBuild);
  gulp.watch("package.json", pkgBuild);
  gulp.watch("config/**/*", parallel(cfgBuild, etcBuild));
  gulp.watch("src/**/*.yml", ymlBuild);
  gulp.watch("src/**/*.json", jsonBuild);
};

/**
 * build
 */
const build = parallel(
  jsBuild,
  hbsBuild,
  pkgBuild,
  cfgBuild,
  etcBuild,
  jsonBuild,
  ymlBuild
);

/**
 * reBuild
 */
const reBuild = series(clean, build);

/**
 * Automatically rebuild on save.
 */
const watch = series(reBuild, fileWatch);

exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.rebuild = reBuild;
exports.default = reBuild;
