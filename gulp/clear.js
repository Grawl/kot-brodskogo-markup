'use strict'
import gulp from 'gulp'
import path from 'path'
import gulpLoadPlugins from 'gulp-load-plugins'
const config = process[process.env.gulp_config_name]
const $ = gulpLoadPlugins()
gulp.task('clear', () => {
	const paths = [
		path.join(config.public, config.imagesResizeFolder),
		path.join(config.cache.root, config.cache.dest),
		path.join(config.imagesToOptimize),
	]
	console.log('Deleting following locations:', paths)
	return gulp.src(paths)
		.pipe($.clean())
})
