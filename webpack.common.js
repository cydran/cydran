const webpack = require("webpack");
const { spawn } = require("child_process");
const path = require("path");

function DtsBundlePlugin() {}
DtsBundlePlugin.prototype.apply = function(compiler) {
	compiler.plugin("afterEmit", function() {
		const generatorArgs = ["dist/src/index.d.ts", "-o", "dist/cydran.d.ts", "--umd-module-name", "cydran", "--external-types"];
		const child = spawn("node_modules/dts-bundle-generator/bin/dts-bundle-generator.js", generatorArgs);

		child.on('exit', function(code, signal) {
			if (code !== 0) {
				console.log("child process exited with code %s and %s", code, signal);
			}
		});

		child.stdout.on("data", (data) => {
			console.log("%s", data);
		});

		child.stderr.on("data", (data) => {
			console.log("%s", data);
		});

	});
};

module.exports = {
	devtool: "source-map",
	output: {
		path: path.resolve(__dirname, "dist"),
		library: "cydran",
		libraryTarget: "umd"
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: path.resolve(__dirname, "src"),
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.html$/,
				include: path.resolve(__dirname, "src"),
				loader: "raw-loader"
			},
			{
				test: /\.tsx?$/,
				include: path.resolve(__dirname, "src"),
				loader: "ts-loader",
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new DtsBundlePlugin()
	]
};
