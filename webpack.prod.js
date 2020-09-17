const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const fs = require("fs");

const CYDRAN_REG = "cydran.js";
const CYDRAN_MIN = "cydran.min.js";
const ENTRY_SRC = "./src/index.ts";

module.exports = merge([common,
	{
		mode: "production",
		entry: {
			"cydran": ENTRY_SRC,
			"cydran.min": ENTRY_SRC
		},
		optimization: {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					include: CYDRAN_MIN,
					exclude: CYDRAN_REG,
					parallel: 4,
					sourceMap: true,
					extractComments: false,
					terserOptions: {
						output: {
							comments: /^\**!|@preserve|@license|@cc_on/i
						},
						ie8: true,
						safari10: true,
						toplevel: true,
						mangle: {
							safari10: true,
							toplevel: true
						}
					}
				})
			]
		},
		plugins: [
			new webpack.BannerPlugin("v" + process.env.npm_package_version + "\n" + fs.readFileSync("./src/cydran_copyright.txt", "utf-8")),
			new CompressionPlugin({
				include: CYDRAN_MIN,
				exclude: /.+\.map$/i
			})
		]
	}
]);
