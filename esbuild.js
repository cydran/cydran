const esb = require("esbuild");
const fs = require("fs-extra");
const path = require("path");
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

const copyBanner =
	`/*\n${process.env.npm_package_version}\n---\n${fs.readFileSync(path.join(__dirname, "src/cydran_copyright.txt"), "utf8")}\n*/`;

const footer = `if (define !== null && define !== undefined && typeof define === "function" && define.amd) define([], function() { return cydran; });`;

const doBuild = (doMin) => {
	esb.build({
		charset: "utf8",
		entryPoints: [`${srcDir}/index.js`],
		target: "es5",
		banner: copyBanner,
		outfile: `${targDir}/${libName}.${doMin ? "min." : ""}js`,
		globalName: libName,
		minify: doMin,
		bundle: true,
		sourcemap: true,
		platform: "browser",
		tsconfig: "tsconfig.esbuild.json",
		format: "iife",
		incremental: incBuild,
		logLevel: "info",
		color: true,
		footer: footer
	}).catch(() => process.exit(1));
};

doBuild(minify);

// https://github.com/rsms/estrella/
