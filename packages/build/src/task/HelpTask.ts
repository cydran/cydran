import AbstractTask from "./AbstractTask";

class HelpTask extends AbstractTask<any> {

	constructor() {
		super("Help");
	}

	execute() {
		console.log("Help Task run");
	}

}

export default HelpTask;
