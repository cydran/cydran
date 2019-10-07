import { CydranError, NEWI } from "../Errors";

class SelectorError extends CydranError {

	constructor(msg: string) {
		if (!new.target) {
			throw (new.target + NEWI);
		}

		super(msg);
	}

}

export default SelectorError;
