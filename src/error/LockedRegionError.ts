import { CydranError } from "@/error/AbstractCydranError";

class LockedRegionError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

export default LockedRegionError;
