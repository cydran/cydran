import { CydranError } from "@/error/AbstractCydranError";

class UnknownElementError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

export default UnknownElementError;
