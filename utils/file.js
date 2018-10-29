const jimp = require('jimp')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const config = require('../webpack.config').config
module.exports = {
	resizeImage,
	getFileContent,
}
function resizeImage(filePath, width, height, method = 'cover') {
	const makeFilePath = string => {
		const size = [
			width ? Math.ceil(width) : 'auto',
			height ? Math.ceil(height) : 'auto',
		].join('-')
		const filePath = path.parse(string)
		const file = fs.readFileSync(path.join(config.inputDir, string))
		const md5 = crypto.createHash('md5').update(file).digest('hex')
		const newFileName = `${filePath.name}-${md5}${filePath.ext}`
		return path.join(config.imagesResizeFolder, method, size, newFileName)
	}
	const newFilePath = path.join(config.outputDir, makeFilePath(filePath))
	if (fs.existsSync(newFilePath)) {
		// console.log(`file "${filePath}" already exists, skip resizing`)
		return makeFilePath(filePath)
	} else {
		// console.log({ filePath, width, height })
		jimp.read(path.join(config.inputDir, filePath))
			.then(image => {
				switch (method) {
					case 'cover':
						return image.cover(
							Number(width), Number(height),
							jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE,
						)
							.write(newFilePath)
					case 'contain':
						return image.contain(
							Number(width), Number(height),
							jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE,
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
function getFileContent(filePath) {
	if (fs.existsSync(filePath)) {
		return fs.readFileSync(filePath, 'utf-8')
	} else {
		return null
	}
}
