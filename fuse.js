const TARGET = 'browser@es5';
const {
	src,
	task,
	exec,
	context
} = require('fuse-box/sparky');

const {
	FuseBox,
	PlainJSPlugin,
	CopyPlugin,
	JSONPlugin,
	EnvPlugin,
	SourceMapPlainJsPlugin,
	UglifyJSPlugin,
	QuantumPlugin
} = require('fuse-box');

const DIR = {
	SRC: "./src/",
	DIST: "./dist/",
	FBC: ".fusebox/",
	DOC: "./dist/docs"
};

const BUNDLE = "cydran";

context(
	class {
		bundleName = BUNDLE;
		isProduction = false;
		isTest = false;
		isBuildOnly = false;
		
		useTreeShake = false;
		minify = false;

		getConfig() {
			const fuse = FuseBox.init({
				homeDir: DIR.SRC,
				target: TARGET,
			  sourceMaps: { project: true, vendor: false },
				tsConfig: 'tsconfig.json',
				cache: true,
				useTypescriptCompiler: true,
				allowSyntheticDefaultImports: true,
				output: DIR.DIST + '$name' + (this.minify?'.min':'') + '.js',
				natives: {
					stream: false,
					process: false,
					Buffer: false,
					http: false,
				},
				package: {
					name: 'cydran',
					main: 'index.ts'
				},
				globals: {
	        cydran: 'cydran',
				},
				log: {
					showBundledFiles: true,
					clearTerminalOnBundle: true
				},
				plugins: [
					PlainJSPlugin(),
					JSONPlugin(),
					SourceMapPlainJsPlugin(),
					PlainJSPlugin(),
					(this.isProduction || this.isBuildOnly  || this.isTest) && QuantumPlugin({
					  polyfills: ["Promise"],
  					uglify: this.minify,
						treeshake: this.useTreeShake,
						bakeApiIntoBundle: this.bundleName,
						extendServerImport: false,
	  				containedAPI: true,
	  				warnings: true,
					}),
				]
			})
			return fuse
		}

		createBundle(fuse) {
			const app = fuse.bundle(this.bundleName);
			if ((!this.isProduction && !this.isTest) && !this.isBuildOnly) {
				app.watch()
				app.hmr()
			}
			if(!this.isTest) {
				app.instructions(" ^> [./index.ts]");
			} else {
				app.test("[src/**/*.spec.ts]")
			}
			return app;
		}
		
		generateDTSFile() {
			const outName = DIR.DIST + this.bundleName + ".d.ts";
			console.log("\nGenerate d.ts file: " + outName + "\n");
			require("dts-generator").default({
				project: "./",
				out: outName,
				indent: "\t",
				eol: "\n",
				target: "es5"
			});
		}
	}
)

task('clean', async context => {
	await src(DIR.DOC).clean(DIR.DOC).exec();
	await src(DIR.DIST).clean(DIR.DIST).exec();
	await src(DIR.FBC).clean(DIR.FBC).exec();
});

task('default', ['clean'], async context => {
	context.isProduction = false;
	context.isBuildOnly = false;
	context.minify = false;
	const fuse = context.getConfig();
	fuse.dev({ port: 8085 });
	context.createBundle(fuse);
	await fuse.run();
});

task('build', ['clean'], async context => {
	context.isProduction = false;
	context.isBuildOnly = true;
	context.minify = false;
	const fuse = context.getConfig();
	context.createBundle(fuse);
	await fuse.run();
	context.generateDTSFile();
});

task('release', ['clean'], async context => {
	context.isProduction = true;
	context.isBuildOnly = false;
	context.minify = true;
	const fuse = context.getConfig();
	context.createBundle(fuse);
	await fuse.run();
	context.generateDTSFile();
});

task('test', ['clean'], async context => {
	context.bundleName = "test";
	context.isProduction = false;
	context.isTest = true;
	const fuse = context.getConfig();
	context.createBundle(fuse);
});
