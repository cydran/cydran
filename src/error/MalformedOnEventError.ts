import { CydranError, NEWI } from "./AbstractCydranError";

class MalformedOnEventError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

export default MalformedOnEventError;
