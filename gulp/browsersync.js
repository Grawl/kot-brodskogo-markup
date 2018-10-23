'use strict'
import gulp from 'gulp'
import browsersync from 'browser-sync'
const config = process.browsersyncConfig
gulp.task('browsersync', () => {
	let settings = {
		logPrefix: 'BrowserSync',
		logConnections: true,
	}
	Object.assign(settings, config)
	return browsersync.init(settings)
})
