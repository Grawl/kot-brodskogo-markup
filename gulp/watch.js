'use strict'
import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
const config = process[process.env.gulp_config_name]
const $ = gulpLoadPlugins()
gulp.task('watch', () => {
	function watch(src, tasks) {
		return $.watch(src, $.batch((events, done) => {
			gulp.start(tasks, done)
		}))
	}
	if (config.viewsToWatch) {
		watch(config.viewsToWatch, ['views'])
	}
	if (config.stylesToWatch) {
		watch(config.stylesToWatch, ['styles'])
	}
	if (config.scriptsToWatch) {
		watch(config.scriptsToWatch, ['scripts'])
	}
})
