import path from 'path';
import autoprefixer from 'autoprefixer';
import gulpif from 'gulp-if';
import Fiber from 'fibers';
import gcmq from 'gulp-group-css-media-queries';
import cssDeclarationSorter from 'css-declaration-sorter';

export default function(gulp, $, args, config, taskTarget, browserSync) {
	const dirs = config.directories;
	const entries = config.entries;
	const dest = path.join(taskTarget, dirs.css);
	const postCssPlugins = [
		autoprefixer({ grid: true }),
		cssDeclarationSorter({
			order: 'concentric-css'
		})
	];

	gulp.task('sass', () => {
		return gulp
			.src(path.join(dirs.source, dirs.app, dirs.css, entries.css))
			.pipe(
				$.plumber({
					errorHandler: $.notify.onError(
						'Error: <%= error.message %>'
					)
				})
			)
			.pipe($.if(!args.production, $.sourcemaps.init({ loadMaps: true })))
			.pipe(
				$.sass({
					fiber: Fiber,
					outputStyle: 'expanded',
					precision: 10
				})
			)
			.on('error', function(err) {
				$.util.log(err);
			})
			.on('error', $.notify.onError(config.defaultNotification))
			.pipe($.postcss(postCssPlugins))
			.pipe($.if(!args.production, gcmq()))
			.pipe(
				$.debug({
					title: 'Compiles:'
				})
			)
			.pipe($.if(args.production, $.cssnano({ rebase: false })))
			.pipe($.if(!args.production, $.sourcemaps.write('./')))
			.pipe(
				$.rename(function(filepath) {
					// Remove 'source' directory as well as prefixed folder underscores
					// Ex: 'src/_scripts' --> '/scripts'
					filepath.dirname = filepath.dirname
						.replace(dirs.source, '')
						.replace(dirs.app, '')
						.replace(dirs.styles, '')
						.replace('_', '');
				})
			)
			.pipe(gulp.dest(dest))
			.pipe(
				browserSync.reload({
					stream: true
				})
			);
	});
}
