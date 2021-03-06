const webpack = require('webpack');
const { spawn } = require('child_process');
const path = require('path');

function DtsBundlePlugin() { }

DtsBundlePlugin.prototype.apply = function(compiler) {
	compiler.plugin('afterEmit', function() {
		const generatorArgs = ['dts-bundle-generator', '--config', 'dts-bundle-generator-config.json'];
		const npxName = /^win/.test(process.platform) ? "npx.cmd" : "npx";
		const child = spawn(npxName, generatorArgs);

		child.on('exit', function(code, signal) {
			if (code !== 0) {
				console.log('child process exited with code %s and %s', code, signal);
			}
		});

		child.stdout.on('data', data => {
			console.log('%s', data);
		});

		child.stderr.on('data', data => {
			console.log('%s', data);
		});
	});
};

module.exports = {
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname, 'dist'),
		library: 'cydran',
		libraryTarget: 'umd'
	},
	resolve: {
		alias: {
			'@': path.resolve('./src')
		},
		extensions: ['.tsx', '.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: path.resolve(__dirname, 'src'),
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.html$/,
				include: path.resolve(__dirname, 'src'),
				loader: 'raw-loader'
			},
			{
				test: /\.tsx?$/,
				include: path.resolve(__dirname, 'src'),
				loader: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	plugins: [new DtsBundlePlugin()]
};
