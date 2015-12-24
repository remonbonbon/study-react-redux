const gulp = require('gulp');
const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack')

// Define source & destination
const BUILD = {
	dest: 'build/',
	js: {
		files: ['src/main.js'],
		output: 'main.js',
	},
	html: {
		files: ['src/main.js'],
	},
};

// Babel with webpack
gulp.task('webpack', ()=> gulp.src(BUILD.js.files)
	.pipe(gulpWebpack({
		watch: true,
		output: {filename: BUILD.js.output},
		module: {
			loaders: [
				{
					test: /\.js$/,
					exclude: /(node_modules|bower_components)/,
					loader: 'babel-loader',
					query: {
						presets: ['es2015', 'react'],
					}
				}
			]
		},
		plugins: [
			new webpack.optimize.UglifyJsPlugin({
				compress: {warnings: false},
				sourceMap: false,
			}),
			new webpack.DefinePlugin({
				'process.env': {NODE_ENV: '"production"'}
			})
		],
	}))
	.pipe(gulp.dest(BUILD.dest))
);

// Copy html
gulp.task('html', ()=> gulp.src(BUILD.html.files)
	.pipe(gulp.dest(BUILD.dest))
);

gulp.task('default', [
	'html',
	'webpack',
]);
