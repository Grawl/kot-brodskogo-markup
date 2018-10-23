import dotenvSafe from 'dotenv-safe'
import path from 'path'
import fs from 'fs'
function filePathOrFallback(path, fallbackPath) {
	try {
		fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
		return path
	} catch (accessError) {
		console.error({ accessError }, 'using fallback path instead')
		return fallbackPath
	}
}
const config = (sample, file) => {
	return {
		path: filePathOrFallback(file, sample),
		sample: sample,
		allowEmptyValues: true,
	}
}
dotenvSafe.load(config(
	path.resolve(process.env.PWD, '.env-dev.example'),
	path.resolve(process.env.PWD, '.env-dev'),
))
export default {
	NODE_ENV: process.env.NODE_ENV ? process.env.NODE_ENV : 'default',
	BROWSERSYNC_PORT: Number(process.env.BROWSERSYNC_PORT),
	BROWSERSYNC_OPEN: JSON.parse(process.env.BROWSERSYNC_OPEN),
	LOCALE: String(process.env.LOCALE),
}
