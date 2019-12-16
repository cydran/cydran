import { CydranError, NEWI } from "./AbstractCydranError";

class NullValueError extends CydranError {

	constructor(msg: string, reps?: any) {
		if (!new.target) { throw (new.target + NEWI); }
		super(msg, reps);
	}

}

export default NullValueError;
