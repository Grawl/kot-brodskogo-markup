import path from 'path'
import env from '../modules/env'
import { frontendRoot } from '../../gulp-config-frontend'
process.browsersyncConfig = {
	port: env.BROWSERSYNC_PORT,
	open: env.BROWSERSYNC_OPEN,
	server: frontendRoot,
	reloadOnRestart: true,
	files: [
		// TODO extend this config from named gulpfiles instead
		path.join(frontendRoot, '*.html'),
	],
}
