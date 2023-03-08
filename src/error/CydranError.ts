abstract class CydranError extends Error {

	public readonly message: string;

	/**
	 * Constructor
	 *
	 * @param msg string Message describing the nature of the error
	 */
	constructor(msg: string) {
		super();

		this.name = new.target.name;
		this.message = msg;
	}

}

export default CydranError;