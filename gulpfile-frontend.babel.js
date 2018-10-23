import './gulp-config-frontend'
import './gulp/config/base'
import './gulp/index'
import gulp from 'gulp'
import gulpStats from 'gulp-stats'
import runSequence from 'run-sequence'
console.log('frontend gulpfile')
runSequence.use(gulp)
gulpStats(gulp)
gulp.task('default', [':publish'])
gulp.task(':watch', done => runSequence(':assemble', 'watch', done))
gulp.task(':live', done => runSequence(':assemble', 'watch', 'browsersync', done))
gulp.task(':publish', done => {
    runSequence(
    	'clear',
        'optimize',
    	'views',
        done,
    )
})
gulp.task(':assemble', done => {
	runSequence(
		[
			'clear',
			'styles',
			'scripts',
			'views',
		],
		done
	)
})
gulp.task(':views', done => {
	runSequence(
		'views',
		done
	)
})
gulp.task(':assets', done => {
    runSequence(
        [
            'styles',
            'scripts',
        ],
        done
    )
})
