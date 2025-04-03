import AbstractTask from "./AbstractTask";
import { native } from "rimraf";

class CleanTask extends AbstractTask<any> {

	constructor() {
		super("Clean");
	}

	public async execute() {
		await this.remove(this.getConfig().getCommon().getDistPath());
		await this.remove(this.getConfig().getCommon().getWorkPath());
	}

	private async remove(path: string): Promise<void> {
		this.print("Removed: " + path);
		await native(path, { glob: false });
	}

}

export default CleanTask;
