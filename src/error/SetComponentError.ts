import { CydranError } from "@/error/AbstractCydranError";

class SetComponentError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

export default SetComponentError;
