import fs from "fs";
import path from "path";
import * as esbuild from "esbuild-wasm";
import AbstractTask from "../AbstractTask.js";
import BuildPaths from "../../build/BuildPaths.js";
import BuildState from "../../build/BuildState.js";
import { BuildConfig } from "../../build/BuildConfig.js";
import { createFooter } from "../../build/Footer.js";
import { requireNotNull } from "../../Utils.js";

/**
 * Bundles the compiled JavaScript into <dist>/<name>.js, and <dist>/<name>.min.js when minification is on: an iife
 * that assigns the global <name>, followed by the footer, each with a sourcemap.
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
			await this.bundle(config, paths, entry, tsConfigPath, false);

			if (config.minify) {
				await this.bundle(config, paths, entry, tsConfigPath, true);
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
	 * esbuild logs nothing itself: esbuild-wasm's service crashes when it writes a log to a stdout or stderr that is
	 * redirected to a file (its fs.writeSync patch calls process.stdout.write, which calls fs.writeSync again). The
	 * task prints the errors and the written files instead.
	 */
	private async bundle(config: BuildConfig, paths: BuildPaths, entry: string, tsConfigPath: string, minify: boolean): Promise<void> {
		const outFile: string = path.resolve(paths.getDistPath(), `${config.name}${minify ? ".min" : ""}.js`);
		let failure: esbuild.Message[] = null;
		let warnings: esbuild.Message[] = [];

		try {
			const result: esbuild.BuildResult = await esbuild.build({
				absWorkingDir: paths.getPackageRoot(),
				entryPoints: [entry],
				target: config.target,
				outfile: outFile,
				globalName: config.name,
				minify: minify,
				bundle: true,
				sourcemap: true,
				platform: config.platform as esbuild.Platform,
				tsconfig: tsConfigPath,
				format: "iife",
				external: config.external,
				logLevel: "silent",
				footer: { js: createFooter(config.name) }
			});
			warnings = result.warnings;
		} catch (error) {
			failure = Array.isArray((error as esbuild.BuildFailure).errors) ? (error as esbuild.BuildFailure).errors : [];
		}

		for (const message of await esbuild.formatMessages(warnings, { kind: "warning", color: false })) {
			console.warn(message);
		}

		if (failure === null) {
			for (const written of [outFile, outFile + ".map"]) {
				this.print(`${paths.relative(written)}  ${(fs.statSync(written).size / 1024).toFixed(1)}kb`);
			}
		} else {
			for (const message of await esbuild.formatMessages(failure, { kind: "error", color: false })) {
				console.error(message);
			}

			throw new Error(`Bundle JavaScript failed: ${paths.relative(outFile)} could not be built`);
		}
	}

}

export default BundleJavaScriptTask;
