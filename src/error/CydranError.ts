abstract class CydranError extends Error {

	public readonly message: string;

	/**
	 * Constructor
	 *
	 * @param msg string object specific to context
	 */
	constructor(msg: string) {
		super();

		this.name = new.target.name;
		this.message = msg;
	}

}

export default CydranError;