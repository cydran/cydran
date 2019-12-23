import { CydranError, NEWI } from "./AbstractCydranError";

class ScopeError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

export default ScopeError;
