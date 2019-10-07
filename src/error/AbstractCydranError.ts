abstract class CydranError extends Error {

	private static rexp = /%\w+%/g;
	public readonly message: string;

/**
 * Constructor
 *
 * @param msg string object specific to context
 * @param reps optional {key:value, <n^1>} object of named substitution values
 * @returns string filled in values in the mesage
 */
	constructor(msg: string, reps?: any) {
		super();

		if(new.target === CydranError) {
			throw TypeError("Direct instantiation of " + new.target.name + " is not allowed.");
		}

		this.message = (reps) ? CydranError.doMsgFilling(msg, reps) : msg;
	}

	private static doMsgFilling(msg: string, reps: any): string {
		return msg.replace(CydranError.rexp, (all: string) => {return reps[all] || all});
	}

}

const NEWI = " needs to be instantiated with 'new'";

export {CydranError, NEWI};