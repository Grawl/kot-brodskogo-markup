module.exports = ctx => {
	return {
		plugins: {
			'postcss-assets': {
				loadPaths: [
					'node_modules',
				],
			},
			'postcss-axis': {},
			'postcss-short': {},
			'postcss-position-alt': {},
			'postcss-inline-svg': {
				path: process.cwd(),
			},
			'autoprefixer': {},
		},
	}
}
