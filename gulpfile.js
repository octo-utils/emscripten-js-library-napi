"use strict";
const path = require("path");
const gulp = require("gulp");
const browserify = require("browserify");
const watchify = require("watchify");
const babelify = require("babelify");
const log = require("fancy-log");
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const streamToPromise = require("stream-to-promise");
const taskFetchDeps = require("gulp-task-fetch-deps");
const rename = require("gulp-rename");
// rollup
// const rollup = require('rollup');
// const rbabel = require('rollup-plugin-babel');
// const rresolve = require('rollup-plugin-node-resolve');

const babelrc = require("./babelrc");

if (typeof process.send !== "function") {
  process.send = _ => void 0;
}

const b = browserify({
  entries:"./src/index.js",
  debug: false
})
  .transform(babelify, {
    ...babelrc
  });

function bundle(b) {
  return streamToPromise(
    b.bundle().on('error', e => log(e))
      .pipe(source('library_napi.js'))
      .pipe(buffer())
      // .pipe(sourcemaps.init({ loadMaps: true }))
      // Add transformation tasks to the pipeline here.
      // .pipe(sourcemaps.write())
      .pipe(gulp.dest('./lib/'))
  )
}

gulp.task("build", _ => {
  return bundle(b);
  // return rollup.rollup({
  //   input: "./src/index.js",
  //   plugins: [
  //     rresolve({jsnext: true}),
  //     rbabel({ ...babelrc }),
  //   ]
  // })
  //   .then(function (bundle) {
  //     bundle.write({
  //       file: "library_napi.js",
  //       format: "cjs",
  //       dir: "./lib"
  //     });
  //   });
});

gulp.task("build-watch", gulp.series("build", _ => {
  let bw = watchify(b);
  bw.on("update", _ => {
    log("source updated ...");
    bundle(bw);
  });
  bundle(bw)
  // gulp.watch(["./src/**/*.js"], gulp.parallel(['build']))
}));

gulp.task("default", gulp.series("build"));

gulp.task("fetch-include-deps", taskFetchDeps(
  require("./include/deps"), "./include", null
));
