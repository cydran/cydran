import { CydranError } from "@/error/AbstractCydranError";

class InvalidTypeError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

export default InvalidTypeError;
