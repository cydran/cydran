import { CydranError, NEWI } from "./AbstractCydranError";

class TemplateError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

export default TemplateError;
