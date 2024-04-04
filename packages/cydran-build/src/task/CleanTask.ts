import AbstractTask from "./AbstractTask";
import fs from "fs";

class CleanTask extends AbstractTask<any> {

	constructor() {
		super("Clean");
	}

	public execute() {
		this.remove(this.getConfig().getCommon().getDistPath());
		this.remove(this.getConfig().getCommon().getWorkPath());
	}

	private remove(path: string): void {
		this.print("Removed: " + path);
		fs.rmSync(path, { recursive: true, force: true});
	}

}

export default CleanTask;
