const path = require('path')
const config = process[process.env.gulp_config_name]
module.exports = ctx => {
	return {
		plugins: {
			'postcss-assets': {
				loadPaths: [path.join(config.public, config.stylesDest)]
			},
			'postcss-axis': {},
			'postcss-short': {},
			'postcss-position-alt': {},
			'postcss-import': {},
			'postcss-inline-svg': {},
			'postcss-single-charset': {},
			'autoprefixer': {
				grid: true,
			},
			'postcss-copy': {
				dest: path.join(config.public, config.stylesDest),
				relativePath(dirname, fileMeta, result, opts) {
					return opts.dest
				},
				template(fileMeta) {
					return path.join(
						config.stylesAssetsFolder,
						fileMeta.path,
						`${fileMeta.name}-${fileMeta.hash}.${fileMeta.ext}`
					)
				}
			}
		}
	}
}
