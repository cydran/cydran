import AbstractTask from "./AbstractTask.js";

class HelpTask extends AbstractTask<any> {

	constructor() {
		super("Help");
	}

	public async execute(): Promise<void> {
		console.log("Help Task run");
	}

}

export default HelpTask;
