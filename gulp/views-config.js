'use strict'
import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'
import get from 'lodash.get'
import jimp from 'jimp'
import marked from 'marked'
import env from './modules/env'
const config = process[process.env.gulp_config_name]
function fontAwesomePath(path) {
	return `node_modules/@fortawesome/fontawesome-free/svgs/${path}`
}
function getFileContent(filePath) {
	const realFilePath = path.join(config.public, filePath)
	if (fs.existsSync(realFilePath)) {
		const fileContent = fs.readFileSync(realFilePath, 'utf-8')
		return fileContent
	} else {
		return null
	}
}
function getTranslationString(config, path) {
	try {
		const file = `translations/messages.${config.locale}.yaml`
		const locale = yaml.safeLoad(fs.readFileSync(file, 'utf8'))
		if (path.match(/[[]]/)) {
			console.warn("Braces are supported by Lodash.get but is not supported by some localization engines, such as Symfony. Please, do not use braces access to localization keys. Instead of `'key[path with spaces]'|trans` just use `'key.path with spaces'|trans` and it will work as expected.")
		}
		return get(locale, path)
	} catch (ex) {
		console.error(ex)
	}
}
function getAssetPath(assetPath) {
	return `/assets/${assetPath}`
}
function getCachedAssetPath(assetPath) {
	const manifestFilePath = path.join(config.cache.root, 'cache-manifest.json')
	if (env.NODE_ENV !== 'production') return getAssetPath(assetPath)
	if (fs.existsSync(manifestFilePath)) {
		const manifestContent = fs.readFileSync(manifestFilePath, 'utf-8')
		const manifest = JSON.parse(manifestContent)
		const cachedAssetPath = manifest[assetPath]
		if (cachedAssetPath) {
			// console.log({ assetPath, cachedAssetPath })
			return getAssetPath(cachedAssetPath)
		} else {
			// console.log('no cached asset', assetPath)
			return getAssetPath(assetPath)
		}
	} else {
		console.log('no manifest', assetPath)
		return getAssetPath(assetPath)
	}
}
function filterClassList(array) {
	/*
	<div class='{{ [
		'foo bar',
		true ? 'yep' : 'nope'
	]|class }}'>
	*/
	return array
		.filter(item => item)
		.join(' ')
}
function resizeImage(filePath, width, height, method = 'cover') {
	const makeFilePath = filePath => {
		const size = [
			width ? Math.ceil(width) : 'auto',
			height ? Math.ceil(height) : 'auto',
		].join('-')
		return path.join(config.imagesResizeFolder, method, size, filePath)
	}
	const newFilePath = path.join(config.public, makeFilePath(filePath))
	if (fs.existsSync(newFilePath)) {
		// console.log(`file "${filePath}" already exists, skip resizing`)
		return makeFilePath(filePath)
	} else {
		// console.log({ filePath, width, height })
		jimp.read(path.join(config.public, filePath))
			.then(image => {
				switch (method) {
					case 'cover':
						return image.cover(
							Number(width), Number(height),
							jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE
						)
							.write(newFilePath)
					case 'contain':
						return image.contain(
							Number(width), Number(height),
							jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE
						)
							.write(newFilePath)
				}
			})
			.catch(error => {
				console.error({ error })
			})
		return makeFilePath(filePath)
	}
}
function md2html(text) {
	return marked(text)
}
export default function(config) {
	return {
		twig: {
			errorLogToConsole: false,
			onError: twigError => {
				throw new Error('Twig')
			},
			// cache: true,
			namespaces: { '@view': config.viewsRoot },
			functions: [
				{
					name: 'fontAwesomePath',
					func(path) {
						return fontAwesomePath(path)
					}
				},
				{
					name: 'file',
					func(path) {
						return getFileContent(path)
					}
				},
			],
			filters: [
				{
					name: 'trans',
					func(path) {
						return getTranslationString(config, path)
					}
				},
				{
					name: 'asset',
					func(assetPath) {
						return getAssetPath(assetPath)
					}
				},
				{
					name: 'cachedAsset',
					func(assetPath) {
						return getCachedAssetPath(assetPath)
					}
				},
				{
					name: 'class',
					func(array) {
						return filterClassList(array)
					}
				},
				{
					name: 'resizeImage',
					func(path, args) {
						const width = args[0]
						const height = args[1]
						const method = args[2]
						return resizeImage(path, width, height, method)
					}
				},
				{
					name: 'md2html',
					func(text) {
						return md2html(text)
					}
				},
			],
			/*
            // The data that is exposed in the twig files. Or use gulp-data to pipe files directly into gulp-twig
            data: [object],
            // sets the views base folder. Extends can be loaded relative to this path
    *		base: [string],
            // enables debug info logging (defaults to false)
            debug: [true|false],
            // enables tracing info logging (defaults to false)
            trace: [true|false],
            // extends Twig with new tags types. The Twig attribute is Twig.js's internal object. Read more here https://github.com/justjohn/twig.js/wiki/Extending-twig.js-With-Custom-Tags
            extend: [function (Twig)],
            // output file extension including the '.' like path.extname(filename). Use true to keep source extname and a "falsy" value to drop the file extension
            extname: [string|true|false],
            // use file contents instead of file path (defaults to false) Read more here https://github.com/zimmen/gulp-twig/issues/30
            useFileContents: [true|false],
            */
		},
	}
}
