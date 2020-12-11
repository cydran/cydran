const esb = require("esbuild");
const libName = "cydran";
const srcDir = "src";
const targDir = "dist";

let minify = false;
if(process.env.min) {
	minify = !!process.env.min;
}

const doBuild = (doMin) => {
	esb
	.build({
		entryPoints: [`${srcDir}/index.ts`],
		outfile: `${targDir}/${libName}.${doMin ? "min." : ""}js`,
		globalName: libName,
		minify: doMin,
		bundle: true,
		sourcemap: true,
		platform: "browser",
		format: "iife"
	})
	.catch(() => process.exit(1));
};

doBuild(false);
if(minify) {
	doBuild(true);
}
