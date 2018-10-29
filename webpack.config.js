const Encore = require('@symfony/webpack-encore')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const dotenvSafe = require('dotenv-safe')
const path = require('path')
const glob = require('glob')
const { writeCompiledConfig } = require('./utils/encore')
const config = {
	inputDir: 'source',
	outputDir: 'public',
	imagesResizeFolder: 'images/resized',
}
module.exports.config = config
const fileUtils = require('./utils/file')
dotenvSafe.load({
	path: path.resolve(process.cwd(), Encore.isProduction()
		? '.env-dev.example'
		: '.env-dev',
	),
	sample: path.resolve(process.cwd(), '.env-dev.example'),
	allowEmptyValues: true,
})
const env = {
	BROWSERSYNC_PORT: Number(process.env.BROWSERSYNC_PORT),
	BROWSERSYNC_OPEN: JSON.parse(process.env.BROWSERSYNC_OPEN),
}
const publicEnv = {
	GOOGLE_CALENDAR_EMBED: String(process.env.GOOGLE_CALENDAR_EMBED),
}
Encore
	.setOutputPath(config.outputDir)
	.setPublicPath('/')
	.cleanupOutputBeforeBuild([
		'**/*.js',
		'**/*.css',
		'**/*.map',
		'**/*.html',
		path.join(config.imagesResizeFolder, '**/*'),
		'manifest.json',
	])
	.enableBuildNotifications()
	.enableSourceMaps(!Encore.isProduction())
	.enableVersioning(Encore.isProduction())
	.configureUglifyJsPlugin(options => {
		if (Encore.isProduction()) {
			options.compress = {
				warnings: false,
				drop_console: true,
			}
			options.comments = false
		}
	})
	.addEntry('script', `./${config.inputDir}/script.js`)
	.createSharedEntry('vendor', [
		'vue/dist/vue',
		`./${config.inputDir}/utils/polyfills.js`,
	])
	.addStyleEntry('style', `./${config.inputDir}/style.scss`)
	.enablePostCssLoader()
	.enableSassLoader()
	.enableVueLoader()
const webpackConfig = Encore.getWebpackConfig()
if (!Encore.isProduction()) {
	addBrowserSyncPlugin()
}
addAliases()
configureModuleRules()
addPugPlugin()
if (!Encore.isProduction()) {
	// Set compiled config in Intellij preferences
	writeCompiledConfig(webpackConfig)
}
function addAliases() {
	webpackConfig.resolve.alias = {
		// Use minified version of Vue on production
		'vue/dist/vue': Encore.isProduction()
			? 'vue/dist/vue.min'
			: 'vue/dist/vue',
	}
}
function configureModuleRules() {
	for (let rule of webpackConfig.module.rules) {
		if (rule.use) {
			for (let loader of rule.use) {
				if (loader.loader === 'babel-loader') {
					// By default, Babel excludes modules imported from node_modules
					// But UglifyJS still does not supports ES6 syntax
					// So, please, do not exclude node_modules from Babel
					// https://github.com/symfony/webpack-encore/issues/139#issuecomment-322592989
					delete rule.exclude
				}
			}
		}
	}
}
function addBrowserSyncPlugin() {
	webpackConfig.plugins.push(new BrowserSyncPlugin({
		port: env.BROWSERSYNC_PORT,
		server: config.outputDir,
		open: env.BROWSERSYNC_OPEN,
		// does not work with html-webpack-plugin
		reloadOnRestart: true,
		files: [
			path.join(config.outputDir, '*.css'),
			path.join(config.outputDir, '*.js'),
			// causes reload on styles change, disable for now
			// path.join(config.outputDir, '*.html'),
		],
	}, {
		reload: false,
		name: 'bs-webpack-plugin',
	}))
}
function addPugPlugin() {
	global.env = publicEnv
	global.resizeImage = fileUtils.resizeImage
	global.getFileContent = fileUtils.getFileContent
	const pugLoader = {
		test: /\.pug$/,
		loader: 'pug-loader',
		options: {
			pretty: !Encore.isProduction(),
			globals: [
				'env',
				'resizeImage',
				'getFileContent',
			],
		},
	}
	webpackConfig.module.rules.push(pugLoader)
	const views = glob.sync(path.join(config.inputDir, '*.pug'))
	views.forEach(view => {
		const file = path.parse(view)
		webpackConfig.plugins.push(
			new HtmlWebpackPlugin({
				filename: `${file.name}.html`,
				template: view,
			}),
		)
	})
}
module.exports = webpackConfig
