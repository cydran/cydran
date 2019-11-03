const ProcessPlugin = require('fuse-box-process-plugin').ProcessPlugin;

const TARGET = 'browser@es5';
const {
	src,
	task,
	context
} = require('fuse-box/sparky');

const {
	FuseBox,
	PlainJSPlugin,
	JSONPlugin,
	SourceMapPlainJsPlugin,
	QuantumPlugin,
	TerserPlugin,
} = require('fuse-box');

const DIR = {
	SRC: "./src/",
	DIST: "./dist/",
	FBC: ".fusebox/",
	DOC: "./dist/docs",
	DEC: "./dist/src"
};

const BUNDLE = "cydran";

context(
	class {
		bundleName = BUNDLE;
		isDev = false;
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
				output: DIR.DIST + "$name" + (this.minify? ".min" : "") + ".js",
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
					(!this.isDev) && QuantumPlugin({
						polyfills: ["Promise"],
					  ensureES5: true,
						treeshake: this.useTreeShake,
						bakeApiIntoBundle: this.bundleName,
						extendServerImport: false,
						containedAPI: true,
						warnings: true,
					}),
					(this.isProduction) && TerserPlugin({
						compress: {
							dead_code: false,
							passes: 2,
							typeofs: false,
						},
						output: {
							beautify: false,
							preamble: "/* minified */",
							ast: true,
							code: true
						}
					}),
					ProcessPlugin({
						process: [
							{
								processKey: "Run d.ts generation",
								processName: "npm",
								processArgs: ["run", "declarations"],
								verbose: false,
							}
						]
					}),
				]
			})
			return fuse;
		}

		createBundle(fuse) {
			const app = fuse.bundle(this.bundleName);

			if ((!this.isProduction && !this.isTest) && !this.isBuildOnly) {
				app.watch();
				app.hmr();
			}

			if (!this.isTest) {
				app.instructions(" ^> [./index.ts]");
			} else {
				app.test("[src/**/*.spec.ts]");
			}

			return app;
		}
	}
);

task('clean', async context => {
	await src(DIR.DOC).clean(DIR.DOC).exec();
	await src(DIR.DIST).clean(DIR.DIST).exec();
	await src(DIR.FBC).clean(DIR.FBC).exec();
});

task('cleanDeclarations', async context => {
	await src(DIR.DEC).clean(DIR.DEC).exec();
});

task('default', ['clean'], async context => {
	context.isDev = true;
	const fuse = context.getConfig();
	// fuse.dev({ port: 8085 });
	context.createBundle(fuse);
	await fuse.run();
});

task('build', ['clean'], async context => {
	context.isBuildOnly = true;
	const fuse = context.getConfig();
	context.createBundle(fuse);
	await fuse.run();
});

task('release', ['clean'], async context => {
	context.isProduction = true;
	context.minify = true;
	const fuse = context.getConfig();
	context.createBundle(fuse);
	await fuse.run();
});
