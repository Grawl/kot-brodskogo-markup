'use strict'
/*
"rollup": "^0.41.6",
*/
import gulp from 'gulp'
import {rollup} from 'rollup'
import notifier from 'node-notifier'
import browserSync from 'browser-sync'
import {
	rollupPlugins,
	bundleSettings,
} from './scripts-config'
const config = process[process.env.gulp_config_name]
let rollupCache = []
gulp.task('scripts', [], done => {
	browserSync.notify('Compiling scripts…', 999999999)
	return Promise.all(config.scriptsToBundle.map((bundleConfig, index) => {
		return rollup({
			input: bundleConfig.entry,
			plugins: rollupPlugins,
			cache: rollupCache[index],
		})
			.then(bundle => {
				rollupCache[index] = bundle
				bundle.write(Object.assign(bundleSettings, {
					file: bundleConfig.dest,
					format: bundleConfig.format,
					context: bundleConfig.context,
					moduleName: bundleConfig.moduleName,
				}))
			})
			.then(() => console.log('bundled:', bundleConfig.entry))
	}))
		.then(() => console.log('all scripts bundled'))
		.then(() => done)
		.then(() => {
			// TODO $.notify() if success after error
			browserSync.reload()
		})
		.catch(error => {
			console.error('scripts bundling error:', error)
			notifier.notify({
				title: 'Rollup',
				message: `${error.message}`,
			})
		})
})
