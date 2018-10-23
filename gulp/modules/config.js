import path from 'path'
import { frontendRoot } from '../../gulp-config-frontend'
function config(options) {
	return {
		viewsRoot: options.viewsRoot,
		viewsToCompile: options.viewsToCompile,
		viewsToWatch: options.viewsToWatch,
		viewsDest: options.viewsDest,
		stylesToCompile: options.stylesToCompile,
		stylesToOptimizeFolder: options.stylesToOptimizeFolder,
		stylesToWatch: options.stylesToWatch,
		stylesDest: options.stylesDest, // relative to `this.public`
		stylesAssetsFolder: options.stylesAssetsFolder, // relative to `this.public`
		scriptsSources: options.scriptsSources,
		scriptsToBundle: options.scriptsToBundle,
		scriptsToOptimizeFolders: options.scriptsToOptimizeFolders,
		scriptsToWatch: options.scriptsToWatch,
		rollupPlugins: options.rollupPlugins,
		imagesToOptimize: options.imagesToOptimize, // just folder
		imagesResizeFolder: options.imagesResizeFolder, // relative to `this.public`
		public: options.public,
		locale: options.locale,
		imageExtensions: options.imageExtensions,
		fontExtensions: options.fontExtensions,
		cache: options.cache,
	}
}
export default config
