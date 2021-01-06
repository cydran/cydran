const esb = require("esbuild");
const fs = require("fs-extra");
const path = require("path");
const libName = "cydran";
const srcDir = "src";
const targDir = "dist";

let minify = false;
let incBuild = false;
if(process.env.min) {
	minify = !!process.env.min;
}
if(process.env.inc) {
	incBuild = !!process.env.inc;
}

const copyBanner =
	`/*\n${process.env.npm_package_version}\n---\n${fs.readFileSync(path.join(__dirname, "src/cydran_copyright.txt"), "utf8")}\n*/`;

const doBuild = (doMin) => {
	esb
		.build({
			charset: "utf8",
			entryPoints: [`${srcDir}/index.ts`],
			banner: copyBanner,
			outfile: `${targDir}/${libName}.${doMin ? "min." : ""}js`,
			globalName: libName,
			minify: doMin,
			bundle: true,
			sourcemap: true,
			platform: "browser",
			format: "iife",
			incremental: incBuild,
			logLevel: "info",
			color: true,
		})
		.catch(() => process.exit(1));
};

doBuild(false);
if(minify) {
	doBuild(true);
}

// https://github.com/rsms/estrella/
