var path = require('path');

var libraryName = 'cydran';

function DtsBundlePlugin(){}
DtsBundlePlugin.prototype.apply = function (compiler) {
	compiler.plugin('done', function() {
		var dts = require('dts-bundle');

		dts.bundle({
			name: libraryName,
			main: 'dist/src/index.d.ts',
			out: '../cydran.d.ts',
			removeSource: true,
			outputAsModuleFolder: true
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
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
//    devtool: 'source-map',
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
