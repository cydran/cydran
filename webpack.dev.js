const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: "development",
  entry: {
    "cydran": "./src/index.ts"
  },
	devServer: {
		contentBase: "./dist"
	}
});
