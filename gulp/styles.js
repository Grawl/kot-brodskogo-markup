'use strict'
/*
"gulp-sourcemaps": "^1.6.0",
"gulp-sass": "^2.3.2",
"gulp-postcss": "^7.0.0",
*/
import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import browserSync from 'browser-sync'
import path from 'path'
import hat from './modules/hat.js'
import stylesConfig from './styles-config'
const config = process[process.env.gulp_config_name]
const $ = gulpLoadPlugins()
gulp.task('styles', () => {
	browserSync.notify('Compiling styles…')
	return gulp.src(config.stylesToCompile)
		.pipe(hat())
		.pipe($.sourcemaps.init())
		.pipe($.sass(stylesConfig(config).sass))
		.pipe($.postcss())
		.pipe($.sourcemaps.write('.', {sourceRoot: config.stylesDest}))
		.pipe(gulp.dest(path.join(config.public, config.stylesDest)))
		// TODO $.notify() if success after error
		.pipe(browserSync.stream({
			match: [
				`**/*.{css,${config.imageExtensions},${config.fontExtensions}}`
			]
		}))
})
