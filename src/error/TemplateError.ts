import { CydranError } from "@/error/AbstractCydranError";

class TemplateError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

export default TemplateError;
