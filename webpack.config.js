var path = require('path');

const { spawn } = require('child_process');

function DtsBundlePlugin(){}
DtsBundlePlugin.prototype.apply = function (compiler) {
	compiler.plugin('afterEmit', function() {
		const generatorArgs = ["dist/src/index.d.ts", "-o", "dist/cydran.d.ts", "--umd-module-name", "cydran", "--external-types"];
		const child = spawn("node_modules/dts-bundle-generator/bin/dts-bundle-generator.js", generatorArgs);

		child.on('exit', function (code, signal) {
			if (code !== 0) {
				console.log("child process exited with code " + code + " and signal " + signal);
			}
		});

		child.stdout.on('data', (data) => {
			console.log(data+'');
		});

		child.stderr.on('data', (data) => {
			console.log(data+'');
		});

	});
};

module.exports = {
	entry: './src/index.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'cydran.js',
		library: 'cydran',
		libraryTarget: 'umd'
	},
	// externals: {
	// 	lodash: {
	// 		commonjs: 'lodash',
	// 		commonjs2: 'lodash',
	// 		amd: 'lodash',
	// 		root: '_'
	// 	}
	// },
	optimization: {
		minimize: false
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.html$/,
				loader: 'raw-loader'
			},
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/
			}
		]
	}
	,plugins: [new DtsBundlePlugin()]
};
