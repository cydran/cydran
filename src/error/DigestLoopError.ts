import { CydranError } from "@/error/AbstractCydranError";

class DigestLoopError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

export default DigestLoopError;
