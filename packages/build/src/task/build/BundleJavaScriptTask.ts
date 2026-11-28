import fs from "fs";
import path from "path";
import * as esbuild from "esbuild-wasm";
import AbstractTask from "../AbstractTask.js";
import BuildPaths from "../../build/BuildPaths.js";
import BuildState from "../../build/BuildState.js";
import { BuildConfig } from "../../build/BuildConfig.js";
import { createUmdHeader, createUmdFooter } from "../../build/UmdWrapper.js";
import { requireNotNull } from "../../Utils.js";

/**
 * Bundles the compiled ES modules into <dist>/<name>.mjs, an ES module, and <dist>/<name>.js, a UMD module, plus their
 * minified variants <dist>/<name>.min.mjs and <dist>/<name>.min.js, each with a sourcemap.
 */
class BundleJavaScriptTask extends AbstractTask<any> {

	private state: BuildState;

	constructor(state: BuildState) {
		super("Bundle JavaScript");
		this.state = requireNotNull(state, "state");
	}

	public async execute(): Promise<void> {
		const config: BuildConfig = this.state.getConfig();
		const paths: BuildPaths = new BuildPaths(this.getConfig());
		const entry: string = paths.getCompiledEntry();

		if (!fs.existsSync(entry)) {
			throw new Error(`Bundle JavaScript failed: compiled entry not found: ${paths.relative(entry)}`);
		}

		const tsConfigPath: string = paths.getBundlerTsConfig();
		fs.writeFileSync(tsConfigPath, JSON.stringify({ compilerOptions: { baseUrl: paths.getCompiledPath() }, include: [] }, null, "\t") + "\n", "utf8");

		try {
			await this.startService();

			const ids: string[] = await this.findUsedDependencies(config, paths, entry, tsConfigPath);
			for (const minify of [false, true]) {
				await this.bundle(paths, this.createOptions(config, paths, entry, tsConfigPath, minify, null));
				await this.bundle(paths, this.createOptions(config, paths, entry, tsConfigPath, minify, ids));
			}
		} finally {
			await esbuild.stop();
		}
	}

	/**
	 * Starts esbuild-wasm's service process with a preload that replaces its process.env with a plain copy. The
	 * service's launcher deletes every environment variable but a few, to work around a Go WebAssembly bug with large
	 * environments. Without the copy, the deletions also reach the real environment of the process, and on Windows
	 * OpenSSL then cannot seed its random number generator (ERR_OSSL_ENTROPY_SOURCE_STRENGTH_TOO_WEAK). With it, Go
	 * still sees only the kept variables. The service inherits NODE_OPTIONS when it is spawned, which happens inside
	 * initialize(), so NODE_OPTIONS is restored right after.
	 */
	private async startService(): Promise<void> {
		const previous: string = process.env.NODE_OPTIONS;
		const preload: string = "--import=data:text/javascript,process.env=Object.assign({},process.env)";
		process.env.NODE_OPTIONS = previous ? `${previous} ${preload}` : preload;

		try {
			await esbuild.initialize({});
		} finally {
			if (previous === undefined) {
				delete process.env.NODE_OPTIONS;
			} else {
				process.env.NODE_OPTIONS = previous;
			}
		}
	}

	/**
	 * The dependencies the UMD bundle requires, from the metafile of a CommonJS build that writes nothing. These, not
	 * every external, become the AMD dependency list: an AMD loader would try to load each entry.
	 */
	private async findUsedDependencies(config: BuildConfig, paths: BuildPaths, entry: string, tsConfigPath: string): Promise<string[]> {
		const options: esbuild.BuildOptions = {
			...this.createOptions(config, paths, entry, tsConfigPath, false, []),
			write: false,
			metafile: true,
			sourcemap: false
		};

		const result: esbuild.BuildResult = await this.runBuild(paths, options);
		const ids: string[] = [];

		for (const output of Object.values(result.metafile.outputs)) {
			for (const imported of output.imports) {
				if (imported.external && ids.indexOf(imported.path) === -1) {
					ids.push(imported.path);
				}
			}
		}

		return ids.sort();
	}

	/**
	 * The options of one bundle: the ES module when ids is null, else the UMD module, which wraps esbuild's CommonJS
	 * output in the UMD header and footer.
	 */
	private createOptions(config: BuildConfig, paths: BuildPaths, entry: string, tsConfigPath: string, minify: boolean, ids: string[]): esbuild.BuildOptions {
		const esm: boolean = (ids === null);
		const options: esbuild.BuildOptions = {
			absWorkingDir: paths.getPackageRoot(),
			entryPoints: [entry],
			target: config.target,
			outfile: paths.getBundleFile(config.name, minify, esm ? ".mjs" : ".js"),
			minify: minify,
			bundle: true,
			sourcemap: true,
			platform: config.platform as esbuild.Platform,
			tsconfig: tsConfigPath,
			format: esm ? "esm" : "cjs",
			external: config.external,
			logLevel: "silent"
		};

		if (!esm) {
			options.banner = { js: createUmdHeader(config.name, ids, config.globals) };
			options.footer = { js: createUmdFooter() };
		}

		return options;
	}

	/**
	 * Builds one bundle and prints its files and sizes.
	 */
	private async bundle(paths: BuildPaths, options: esbuild.BuildOptions): Promise<void> {
		await this.runBuild(paths, options);

		for (const written of [options.outfile, options.outfile + ".map"]) {
			this.print(`${paths.relative(written)}  ${(fs.statSync(written).size / 1024).toFixed(1)}kb`);
		}
	}

	/**
	 * esbuild logs nothing itself: esbuild-wasm's service crashes when it writes a log to a stdout or stderr that is
	 * redirected to a file (its fs.writeSync patch calls process.stdout.write, which calls fs.writeSync again). The
	 * task prints the warnings and errors instead.
	 */
	private async runBuild(paths: BuildPaths, options: esbuild.BuildOptions): Promise<esbuild.BuildResult> {
		let result: esbuild.BuildResult = null;
		let failure: esbuild.Message[] = null;

		try {
			result = await esbuild.build(options);
		} catch (error) {
			failure = Array.isArray((error as esbuild.BuildFailure).errors) ? (error as esbuild.BuildFailure).errors : [];
		}

		if (failure === null) {
			for (const message of await esbuild.formatMessages(result.warnings, { kind: "warning", color: false })) {
				console.warn(message);
			}
		} else {
			for (const message of await esbuild.formatMessages(failure, { kind: "error", color: false })) {
				console.error(message);
			}

			throw new Error(`Bundle JavaScript failed: ${paths.relative(options.outfile)} could not be built`);
		}

		return result;
	}

}

export default BundleJavaScriptTask;
