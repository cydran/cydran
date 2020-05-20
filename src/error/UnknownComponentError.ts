import { CydranError } from "@/error/AbstractCydranError";

class UnknownComponentError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

export default UnknownComponentError;
