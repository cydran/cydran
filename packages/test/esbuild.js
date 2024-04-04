const esb = require("esbuild");
const fs = require("fs-extra");
const path = require("path");
const libName = "test";
const srcDir = "dist/src";
const targDir = "dist";
const { dependencies } = require('./package.json');
const externalPackages = Object.keys(dependencies);

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

const footer = fs.readFileSync("conf/footer.js", "utf8");

const doBuild = () => {
	esb.build({
		entryPoints: [`${srcDir}/index.js`],
		target: "es6",
		banner: { js: copyBanner },
		outfile: `${targDir}/${libName}.js`,
		globalName: libName,
		minify: false,
		bundle: true,
		sourcemap: true,
		platform: "node",
		tsconfig: "tsconfig.esbuild.json",
		format: "iife",
		logLevel: "info",
		color: true,
		external: externalPackages,
		footer: { js: footer }
	}).catch(() => process.exit(1));
};

doBuild();

// https://github.com/rsms/estrella/
