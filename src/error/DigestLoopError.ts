import { CydranError, NEWI } from "./AbstractCydranError";

class DigestLoopError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

export default DigestLoopError;
