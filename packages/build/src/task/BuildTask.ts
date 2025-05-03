import AbstractTask from "./AbstractTask.js";
import TranspilerFacade from '../TranspilerFacade.js';
import path from "path";

class BuildTask extends AbstractTask<any> {

	private jsPath: string;

	constructor() {
		super("Build");
	}

	public async execute(): Promise<void> {
		this.jsPath = path.resolve(this.getConfig().getCommon().getWorkPath(), "js");
		this.compile();
		this.aggregate();
		this.minify();
		this.copyResources();
	}

	private compile(): void {
		this.print("== Compiling Source Files ====================================================");
		const compiler: TranspilerFacade = new TranspilerFacade(this.getConfig().getCommon().getSrcPath(), this.jsPath, this.getConfig().getEnvironment());
		compiler.compile();
		this.blankLine();
	}

	private aggregate(): void {
		this.print("== Aggregating ECMAScript ====================================================");
		this.blankLine();
	}

	private minify(): void {
		this.print("== Minifying ECMAScript ======================================================");
		this.blankLine();
	}

	private copyResources(): void {
		this.print("== Copying Resources =========================================================");
		this.blankLine();
	}

}

export default BuildTask;
