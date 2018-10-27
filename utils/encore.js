'use strict'

const { writeFileSync } = require('fs')

/**
 * Traverses a javascript object, and deletes all circular values
 * @see: https://stackoverflow.com/a/31291509/9913147
 * @param {Object} source object to remove circular references from
 * @param {string} censoredMessage optional: what to put instead of censored values
 * @param censorTheseItems should be kept null, used in recursion
 * @returns {undefined}
 */
function preventCircularJson(source, censoredMessage, censorTheseItems) {
	// init recursive value if this is the first call
	censorTheseItems = censorTheseItems || [source]
	// default if none is specified
	censoredMessage = censoredMessage || 'CIRCULAR_REFERENCE_REMOVED'
	// values that have allready apeared will be placed here:
	const recursiveItems = {}
	// initiate a censored clone to return back
	const ret = {}
	// traverse the object:
	for (const key in source) {
		const value = source[key]
		if (typeof value === 'object') {
			// re-examine all complex children again later:
			recursiveItems[key] = value
		} else {
			// simple values copied as is
			ret[key] = value
		}
	}
	// create list of values to censor:
	const censorChildItems = []
	for (const key in recursiveItems) {
		const value = source[key]
		// all complex child objects should not apear again in children:
		censorChildItems.push(value)
	}
	// censor all circular values
	for (const key in recursiveItems) {
		let value = source[key]
		let censored = false
		censorTheseItems.forEach(function (item) {
			if (item === value) {
				censored = true
			}
		})
		if (censored) {
			// change circular values to this
			value = censoredMessage
		} else {
			// recursion:
			value = preventCircularJson(
				value,
				censoredMessage,
				censorChildItems.concat(censorTheseItems)
			)
		}
		ret[key] = value
	}

	return ret
}

// Webpack Encore integration with Intellij
// @see https://github.com/symfony/webpack-encore/issues/236
function writeCompiledConfig(config) {
	writeFileSync(
		'webpack.config.compiled.js',
		`module.exports = ${JSON.stringify(preventCircularJson(config))}`
	)
}

module.exports = {
	preventCircularJson,
	writeCompiledConfig,
}
