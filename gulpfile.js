const gulp = require('gulp'),
  es6ify = require('es6ify'),
  $ = require('gulp-load-plugins')();

gulp.task('js', () =>
  gulp.src([
    'src/x-gif.js',
    'src/x-gif.angular.js'
  ])
    .pipe($.plumber())
    .pipe($.browserify({
      add: [es6ify.runtime],
      transform: ['es6ify']
    }))
    .pipe($.uglify())
    .pipe(gulp.dest('dist'))
);

gulp.task('html', () =>
  gulp.src('src/x-gif.html')
    .pipe($.rename('x-gif.local.html'))
    .pipe(gulp.dest('dist'))
);

gulp.task('css', (done) => {
  $.sass('src/x-gif.scss')
    .pipe($.autoprefixer("last 2 versions", "> 1%"))
    .pipe(gulp.dest('dist'))
  done();
});

gulp.task('vulcanize', () =>
  gulp.src('dist/x-gif.local.html')
    .pipe($.vulcanize({ dest: 'dist', inline: true }))
    .pipe($.rename('x-gif.html'))
    .pipe(gulp.dest('dist'))
);

gulp.task('copy', () =>
  gulp.src([
    'bower_components/platform.js/platform.js',
    'bower_components/polymer/polymer*',
    'bower_components/polymer/layout*',
  ]).pipe(gulp.dest('dist'))
);

gulp.task('build', gulp.series(['js', 'html', 'css', 'copy', 'vulcanize']));

gulp.task('connect', () => {
  $.connect.server({
    root: [__dirname],
    port: 1983,
    livereload: { port: 2983 }
  })
});

gulp.task('default', gulp.series(['build', 'connect', () => {
  gulp.watch(['src/*.*js'], ['js']);
  gulp.watch(['src/*.html'], ['html']);
  gulp.watch(['src/*.scss'], ['css']);
  gulp.watch(['bower_components'], ['copy']);
  gulp.watch(['dist/x-gif.local.html', 'dist/x-gif.js', 'dist/x-gif.css'], ['vulcanize']);

  return gulp.watch(['index.html', 'dist/**.*', 'demos/**.*'], function (event) {
    return gulp.src(event.path)
      .pipe($.connect.reload());
  })
}]));

