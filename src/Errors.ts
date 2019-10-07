export abstract class CydranError extends Error {

	public readonly message: string;

	constructor(msg: string) {
		super();

		if (new.target === CydranError) {
			throw TypeError("Direct instantiation of CydranError is not allowed.");
		}

		this.message = msg;
	}

}

export const NEWI = " needs to be instantiated with 'new'";

export class RegistrationError extends CydranError {

	constructor(msg: string) {
		if (!new.target) {
			throw (new.target + NEWI);
		}

		super(msg);
	}

}

export class ElementBindingSelectionError extends CydranError {

	constructor(msg: string) {
		if (!new.target) {
			throw (new.target + NEWI);
		}

		super(msg);
	}

}
