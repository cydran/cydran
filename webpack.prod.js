const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const fs = require("fs");

const REG_C = "cydran.js";
const MIN_C = "cydran.min.js";
const IDX_S = "./src/index.ts";

module.exports = merge(common, {
	mode: "production",
	entry: {
		"cydran": IDX_S,
		"cydran.min": IDX_S
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				include: MIN_C,
				exclude: REG_C,
				parallel: 4,
				sourceMap: true,
				terserOptions: {
					output: {
						comments: false
					}
				},
				extractComments: false
			})
		]
	},
	plugins: [
		new webpack.BannerPlugin(fs.readFileSync("./src/cydran_copyright.txt", "utf-8")),
		new CompressionPlugin({
			include: MIN_C,
			exclude: /.+\.map$/i,
			filename: "[path].gz[query]",
			algorithm: "gzip"
		})
	]
});
