import AbstractTask from "./AbstractTask.js";

class EjectTask extends AbstractTask<any> {

	constructor() {
		super("Eject");
	}

	public async execute(): Promise<void> {
		console.log("Not yet implemented");

		// TODO - Implement
		// Copy cydran-build.js to [project]/scripts/cydran-build.js
		// Update scripts in package.json
		// Add dev dependencies
		// Run npm install
	}

}

export default EjectTask;
