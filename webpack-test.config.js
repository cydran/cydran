var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
	mode: "development",
	entry: './src/all-tests.js',
	output: {
		filename: 'testBundle.js'
	},
	target: 'node',
	externals: [nodeExternals()],
	node: {
		fs: 'empty'
	},
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
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
	},
	plugins: [
		new WebpackShellPlugin({
			onBuildExit: "mocha ./dist/testBundle.js"
		})
	]
};
