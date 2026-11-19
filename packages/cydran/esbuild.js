const esb = require("esbuild");
const fs = require("fs-extra");
const libName = "cydran";
const srcDir = "dist/src";
const targDir = "dist";

let minify = false;
let incBuild = false;

if (process.env.min) {
	minify = !!process.env.min;
}

if (process.env.inc) {
	incBuild = !!process.env.inc;
}

const footer = fs.readFileSync("conf/footer.js", "utf8");

const doBuild = (doMin) => {
	esb.build({
		entryPoints: [`${srcDir}/index.js`],
		target: "esnext",
		outfile: `${targDir}/${libName}${doMin ? ".min" : ""}.js`,
		globalName: libName,
		minify: doMin,
		bundle: true,
		sourcemap: true,
		platform: "browser",
		tsconfig: "tsconfig.esbuild.json",
		format: "iife",
		// incremental: incBuild,
		logLevel: "info",
		color: true,
		footer: { js: footer }
	}).catch(() => process.exit(1));
};

doBuild(minify);

// https://github.com/rsms/estrella/
