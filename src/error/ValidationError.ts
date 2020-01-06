import { CydranError } from "@/error/AbstractCydranError";

class ValidationError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

export default ValidationError;
