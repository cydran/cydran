import fs from "fs";
import AbstractTask from "../AbstractTask.js";
import BuildPaths from "../../build/BuildPaths.js";

/**
 * Removes the compiled output and the generated tsconfig files from the work directory once the build succeeded.
 */
class RemoveWorkOutputTask extends AbstractTask<any> {

	constructor() {
		super("Remove Work Output");
	}

	public async execute(): Promise<void> {
		const paths: BuildPaths = new BuildPaths(this.getConfig());

		for (const workPath of [paths.getCompiledPath(), paths.getDeclarationsTsConfig(), paths.getBundlerTsConfig()]) {
			fs.rmSync(workPath, { recursive: true, force: true });
			this.print("Removed: " + paths.relative(workPath));
		}
	}

}

export default RemoveWorkOutputTask;
