import { CydranError } from "@/error/AbstractCydranError";

class ModuleAffinityError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

export default ModuleAffinityError;
