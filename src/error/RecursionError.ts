import { CydranError } from "@/error/AbstractCydranError";

class RecursionError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

export default RecursionError;
