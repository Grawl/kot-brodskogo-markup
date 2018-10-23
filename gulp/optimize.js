'use strict'
import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import cssNano from 'cssnano'
import crypto from 'crypto'
import { obj as readStream } from 'through2'
import path from 'path'
import fs from 'fs'
const config = process[process.env.gulp_config_name]

const $ = gulpLoadPlugins()
const assetsTasks = []

if(config.imagesToOptimize) {
	assetsTasks.push('optimize:images')
	images()
}
if (config.stylesToCompile) {
	assetsTasks.push('optimize:css')
	css()
}
if (config.scriptsToBundle) {
	assetsTasks.push('optimize:js')
	js()
}

function css() {
	/*
	"gulp-postcss": "^7.0.0",
	"cssnano": "^3.7.5",
	*/
	const postcssPlugins = {
		cssNano: cssNano
	}
	gulp.task('optimize:css', [':assets'], () => {
		return gulp.src(path.join(config.stylesToOptimizeFolder, '*.css'))
			.pipe($.postcss([
				postcssPlugins.cssNano
			]))
			.pipe(gulp.dest(config.stylesToOptimizeFolder))
	})
}

function js() {
	/*
	"gulp-uglify": "^2.0.0",
	*/
	gulp.task('optimize:js', [':assets'], () => {
		let src = []
		config.scriptsToOptimizeFolders.forEach(
			folder => src.push(path.join(folder, '*.js'))
		)
		src.push('!gulpfile.js')
		return gulp.src(src)
			.pipe($.uglify({
				compress: {
					drop_console: true
				}
			}))
			.pipe(gulp.dest(file => file.base))
	})
}

function images() {
	/*
	"gulp-imagemin": "^3.3.0",
	*/
	gulp.task('optimize:images', [':assets'], () => {
		return gulp.src(path.join(config.imagesToOptimize, `**/*.{${config.imageExtensions}}`))
			.pipe($.imagemin())
			.pipe(gulp.dest(config.imagesToOptimize))
	})
}

function cache() {
	/*
	"gulp-flatten": "^0.4.0",
	"gulp-rename": "^1.2.2",
	*/
	gulp.task('optimize:cache', assetsTasks, () => {
		const dir = path.join(process.cwd(), config.cache.root)
		const dest = path.join(dir, config.cache.dest)
		const manifest = {}
		let buffer = {}

		if (fs.existsSync(dest)) {
			for (const file of fs.readdirSync(dest)) {
				fs.unlinkSync(path.join(dest, file))
			}
		} else {
			fs.mkdirSync(dest)
		}

		return gulp.src(config.cache.src.map(e => path.join(dir, e)))
			.pipe(readStream((chunk, enc, callback) => {
				const baseDir = path.dirname(chunk.path).replace(dir, '')
				if (chunk._contents !== null) {
					buffer = {
						suffix: '.' + crypto.createHash('md5').update(chunk._contents).digest('hex'),
						baseDir
					}
					callback(null, chunk)
				} else {
					callback(null)
				}
			}))
			.pipe($.flatten())
			.pipe($.rename(file => {
				const originalFilePath = path.posix.join(buffer.baseDir, file.basename + file.extname).replace(path.sep, '')
				const cachedFilePath = path.posix.join(config.cache.dest, file.basename + buffer.suffix + file.extname)
				manifest[originalFilePath] = cachedFilePath
				file.basename += buffer.suffix
			}))
			.pipe(gulp.dest(dest))
			.on('end', () => {
				fs.writeFileSync(path.join(dir, 'cache-manifest.json'), JSON.stringify(manifest, null, 4), {
					flag: 'w'
				})
				fs.symlinkSync(path.join(dir, 'linked'), path.join(dest, 'linked'), process.platform === 'win32'
					? 'junction'
					: 'file'
				)
			})
	})
}
const optimizeTasks = []
if (config.cache) {
	optimizeTasks.push('optimize:cache')
	cache()
}
let sequence = []
sequence = sequence.concat(assetsTasks, optimizeTasks)
gulp.task('optimize', sequence)
