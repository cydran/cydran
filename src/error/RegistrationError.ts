import { CydranError, NEWI } from "./AbstractCydranError";

class RegistrationError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

export default RegistrationError;
