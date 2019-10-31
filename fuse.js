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
	        cydran: 'cydran'
				},
				log: {
					showBundledFiles: false,
					clearTerminalOnBundle: false
				},
				plugins: [
					SourceMapPlainJsPlugin(),
					PlainJSPlugin(),
					(this.isProduction || this.isBuildOnly) && QuantumPlugin({
  					removeUseStrict: false,
  					ensureES5: true,
  					manifest: false,
						uglify: this.useUglify,
  					uglify: this.minify,
						treeshake: this.useTreeShake,
						bakeApiIntoBundle: BUNDLE,
						extendServerImport: false,
	  				containedAPI: true,
					})
				]
			})
			return fuse
		}

		createBundle(fuse) {
			const app = fuse.bundle(BUNDLE);
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
	}
)

task('clean', async context => {
	await src(DIR.DOC).clean(DIR.DOC).exec();
	await src(DIR.DIST).clean(DIR.DIST).exec();
	await src(DIR.FBC).clean(DIR.FBC).exec();
});

task('default', ['clean'], async context => {
	const fuse = context.getConfig();
	fuse.dev({ port: 8085 });
	context.createBundle(fuse);
	await fuse.run();
});

task('build', ['clean'], async context => {
	context.isBuildOnly = true;
	context.minify = false;
	const fuse = context.getConfig();
	context.createBundle(fuse);
	await fuse.run();
});

task('dist', ['build'], async context => {
	context.isProduction = true;
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
