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
	QuantumPlugin
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
					(this.isProduction || this.isBuildOnly || this.isTest) && QuantumPlugin({
						polyfills: ["Promise"],
						uglify: this.minify,
						treeshake: this.useTreeShake,
						bakeApiIntoBundle: this.bundleName,
						extendServerImport: false,
						containedAPI: true,
						warnings: true,
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
	context.isProduction = false;
	context.isBuildOnly = false;
	context.minify = false;
	const fuse = context.getConfig();
	// fuse.dev({ port: 8085 });
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
});

task('release', ['clean'], async context => {
	context.isProduction = true;
	context.isBuildOnly = false;
	context.minify = true;
	const fuse = context.getConfig();
	context.createBundle(fuse);
	await fuse.run();
});

task('test', ['clean'], async context => {
	context.bundleName = "test";
	context.isProduction = false;
	context.isTest = true;
	const fuse = context.getConfig();
	context.createBundle(fuse);
});