import { CydranError } from "@/error/AbstractCydranError";

class AmbiguousMarkupError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

export default AmbiguousMarkupError;
