import { CydranError } from "@/error/AbstractCydranError";

class UnknownRegionError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

export default UnknownRegionError;
