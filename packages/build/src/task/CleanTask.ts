import AbstractTask from "./AbstractTask";
import rimraf from "rimraf";

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
		rimraf.sync(path);
	}

}

export default CleanTask;
