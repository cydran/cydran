import { CydranError } from "@/error/AbstractCydranError";

class NullValueError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

export default NullValueError;
