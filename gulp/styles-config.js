'use strict'
/*
"node-sass-magic-importer": "^5.0.0-alpha.15",
*/
import magicImporter from 'node-sass-magic-importer'
export default function(config) {
	return {
		sass: {
			output: 'nested',
			importer: magicImporter(),
		},
	}
}
