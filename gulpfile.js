//--include packages
var gulp = require('gulp');
var del = require('del');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sftp = require('gulp-sftp');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();


gulp.task('watch', ['browserSync', 'rebuild'], function (){
  gulp.watch('src/*.scss', ['process_css']);
  gulp.watch('src/*.html', ['process_html']);
  //gulp.watch('src/*.php', ['process_php']);
  gulp.watch('src/*.js', ['process_js']);
  //gulp.watch('src/img/*', ['process_img']);
});

//--SASS
gulp.task('process_css', function(callback) {
  runSequence('sass_css',
			  'build_css',
			  //'upload_css',
              callback);
});

gulp.task('sass_css', function() {
  return gulp.src('src/*.scss') // Gets all files ending with .scss in app/scss
    .pipe(sass())
    .pipe(gulp.dest('src/'));
});

gulp.task('build_css', function() {
  return gulp.src('src/*.css')
  .pipe(concat('styles.css'))
  .pipe(gulp.dest('public/css/'))
  .pipe(browserSync.reload({
      stream: true
    }));
});

//--HTML
gulp.task('process_html', function(callback) {
  runSequence('build_html',
			  //'upload_html',
              callback);
});

gulp.task('build_html', function() {
  return gulp.src('src/*.html')
  .pipe(gulp.dest('public/'))
  .pipe(browserSync.reload({
      stream: true
    }));
});

//--JavaScript
gulp.task('process_js', function(callback) {
  runSequence(//'lint',
			  'build-js',
			  //'upload-js',
              callback);
});

gulp.task('build-js', function() {
  return gulp.src('src/*.js')
  /*return gulp.src(['src/js/index.js', 'src/js/contact.js'])  */
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest('public/js/'))
  .pipe(browserSync.reload({
      stream: true
    }));
});

/*
//--PHP
gulp.task('process_php', function(callback) {
  runSequence('build_php',
			  'upload_php',
              callback);
});

gulp.task('build_php', function() {
  return gulp.src('src/*.php')
  .pipe(gulp.dest('pub/'))
  .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('upload_php', function () {
    return gulp.src('./pub/*.php')
        .pipe(sftp({
            host: sftpHost,
            user: sftpUser,
            pass: sftpPass,
			port: sftpPort,
			remotePath: sftpRemotePath
        }));
});
*/
/*
//--Vendor
gulp.task('process_vendor', function (callback) {
	runSequence('upload_bootstrap_css',
				'upload_bootstrap_js',
				'upload_jquery',
				callback);
});

gulp.task('upload_bootstrap_css', function () {
	return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
		.pipe(sftp({
			host: sftpHost,
			user: sftpUser,
			pass: sftpPass,
			port: sftpPort,
			remotePath: sftpRemotePathCss
		}));
});

gulp.task('upload_bootstrap_js', function () {
	return gulp.src('node_modules/bootstrap/dist/js/bootstrap.min.js')
		.pipe(sftp({
			host: sftpHost,
			user: sftpUser,
			pass: sftpPass,
			port: sftpPort,
			remotePath: sftpRemotePathJs
		}));
});

gulp.task('upload_jquery', function () {
	return gulp.src('node_modules/jquery/dist/jquery.min.js')
		.pipe(sftp({
			host: sftpHost,
			user: sftpUser,
			pass: sftpPass,
			port: sftpPort,
			remotePath: sftpRemotePathJs
		}));
});
*/

//--BrowserSync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'public/'
    },
  })
});


//--Rebuild
gulp.task('rebuild', function(callback) {
  runSequence('process_css',
			  'process_html',
			  'process_js',
			  //'process_img',
			 // 'process_php',
			 // 'process_vendor',
			  //'upload_htaccess',
              callback);
});
