import { CydranError, NEWI } from "./AbstractCydranError";

class SelectorError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

export default SelectorError;
