const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const ENTRY_SRC = "./src/index.ts";

module.exports = merge([
	common,
	{
		mode: "development",
		entry: {
			"cydran": ENTRY_SRC
		},
		devServer: {
			contentBase: "./dist"
		}
	}
]);
