import AbstractTask from "./AbstractTask";

class HelpTask extends AbstractTask<any> {

	constructor() {
		super("Help");
	}

	public async execute(): Promise<void> {
		console.log("Help Task run");
	}

}

export default HelpTask;
