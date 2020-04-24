const gulp = require('gulp');
const {
  go
} = require('./dist/index');

gulp.task('default', function () {
  console.log('default runned');

  const watcher = gulp.watch('*.js');

  watcher.on('change', (path) => {
    go(path);
  })
})