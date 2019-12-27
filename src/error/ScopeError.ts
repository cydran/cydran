import { CydranError } from "@/error/AbstractCydranError";

class ScopeError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

export default ScopeError;
