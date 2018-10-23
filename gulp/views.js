'use strict'
/*
"gulp-twig": "^1.2.0",
*/
import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import browserSync from 'browser-sync'
import path from 'path'
import hat from './modules/hat.js'
import viewsConfig from './views-config'
const config = process[process.env.gulp_config_name]
const $ = gulpLoadPlugins()
gulp.task('views', () => {
	browserSync.notify('Compiling views…', 999999999)
	return gulp.src(config.viewsToCompile)
		.pipe(hat())
		.pipe($.twig(viewsConfig(config).twig))
		.pipe(gulp.dest(path.join(config.public, config.viewsDest)))
		// TODO $.notify() if success after error
})
