/*
"rollup-load-plugins": "^0.3.0",
"babelrc-rollup": "^3.0.0",
"rollup-plugin-sourcemaps": "^0.4.2",
"rollup-plugin-node-resolve": "^3.0.0",
"rollup-plugin-includepaths": "^0.2.2",
"rollup-plugin-babel": "^2.7.1",
"rollup-plugin-progress": "^0.2.1",
"rollup-plugin-visualizer": "^0.2.1",
*/
import babelrc from "babelrc-rollup"
import rollupLoadPlugins from "rollup-load-plugins"
const config = process[process.env.gulp_config_name]
const $rollup = rollupLoadPlugins()
let plugins = [
	$rollup.sourcemaps({ loadMaps: true }),
	$rollup.nodeResolve({
		browser: true,
	}),
	$rollup.includepaths({
		paths: config.scriptsSources,
		extensions: ['.js'],
	}),
	$rollup.babel(babelrc()),
	$rollup.progress({
		clearLine: false
	}),
	$rollup.visualizer({
		filename: './rollup-visualizer.html'
	}),
]
export const rollupPlugins = config.rollupPlugins.concat(plugins)
export const bundleSettings = {
	sourceMap: true,
}
