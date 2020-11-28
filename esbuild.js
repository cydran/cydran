const esb = require("esbuild");
const libName = "cydran";
const srcDir = "src";
const targDir = "dist";
const minify = (!!process.env.min && true == process.env.min);

const doBuild = () => {
	esb
	.build({
		entryPoints: [`${srcDir}/index.ts`],
		outfile: `${targDir}/${libName}.${minify ? "min." : ""}js`,
		globalName: libName,
		minify: minify,
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
