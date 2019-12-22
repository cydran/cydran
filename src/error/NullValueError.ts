import { CydranError, NEWI } from "./AbstractCydranError";

class NullValueError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

export default NullValueError;
