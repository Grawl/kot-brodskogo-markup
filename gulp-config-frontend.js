import path from 'path'
import rollupLoadPlugins from 'rollup-load-plugins'
import env from './gulp/modules/env'
import config from './gulp/modules/config'
const $rollup = rollupLoadPlugins()
export const frontendRoot = 'public'
const prod = process.env.NODE_ENV === 'production'
process['frontend-gulp-config'] = config({
	viewsRoot: path.join(frontendRoot, 'source/'),
	viewsToCompile: path.join(frontendRoot, 'source/*.twig'),
	viewsToWatch: [
		path.join(frontendRoot, 'source/**/*.twig'),
		path.join(frontendRoot, 'source/**/*.md'),
		path.join(frontendRoot, 'source/**/*.html'),
		path.join(frontendRoot, 'source/**/*.txt'),
		'translations/*.yaml',
		'translations/*.yml',
	],
	viewsDest: '', // relative to `this.public`
	stylesToCompile: path.join(frontendRoot, 'source/*.{sass,scss}'),
	stylesToOptimizeFolder: path.join(frontendRoot, ''),
	stylesToWatch: [
		path.join(frontendRoot, 'source/**/*.{sass,scss}'),
	],
	stylesDest: 'assets/', // relative to `this.public`
	stylesAssetsFolder: 'linked/', // relative to `this.public`
	scriptsSources: path.join(frontendRoot, 'source/assets'),
	scriptsToBundle: [{
		entry: path.join(frontendRoot, 'source/script.js'),
		dest: path.join(frontendRoot, 'assets/script.js'),
		format: 'iife',
		context: 'window',
		moduleName: 'script',
	}],
	scriptsToOptimizeFolders: [
		path.join(frontendRoot, 'assets'),
	],
	scriptsToWatch: [
		path.join(frontendRoot, 'source/**/*.js'),
	],
	rollupPlugins: [
		$rollup.replace({
			'__ENV': env.NODE_ENV,
			'vue/dist/vue': prod ? 'vue/dist/vue.min' : 'vue/dist/vue',
		}),
		$rollup.commonjs({
			include: 'node_modules/**/*',
			// namedExports: { 'jquery': ['$', 'jQuery'] }
		}),
	],
	imagesToOptimize: path.join(frontendRoot, 'assets/linked'), // just folder
	imagesResizeFolder: 'assets/resize', // relative to `this.public`
	public: frontendRoot,
	locale: env.LOCALE,
	imageExtensions: 'svg,jpeg,jpg,png,gif',
	fontExtensions: 'svg,ttf,woff,otf,eot',
	cache: {
		src: [
			'*.{js,css}',
			'images/**/*',
		],
		root: path.join(frontendRoot, 'assets'),
		dest: 'cached', // relative to `this.cache.root`
	},
})
