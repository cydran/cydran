import AbstractCompoundTask from "./AbstractCompoundTask.js";
import FixSourceHeadersTask from "./fix/FixSourceHeadersTask.js";

class FixTask extends AbstractCompoundTask {

	constructor() {
		super("Fix");
		this.add(new FixSourceHeadersTask());
	}

}

export default FixTask;
