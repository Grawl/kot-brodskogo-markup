import gulpLoadPlugins from 'gulp-load-plugins'
const $ = gulpLoadPlugins()
export default error => {
	return $.plumber({
		errorHandler: $.notify.onError('Error: <%= error.message %>')
	})
}
