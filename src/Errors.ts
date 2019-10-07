abstract class CydranError extends Object {
  public readonly message: string;

  constructor(msg: string) {
    super();
    if(new.target === CydranError) {
      throw TypeError("Direct instantiation of CydranError is not allowed.");
    }
    this.message = msg;
  }
}

const NEWI = " needs to be instantiated with 'new'";

export class SelectorError extends CydranError {

	constructor(msg: string) {
		if (!new.target) {
			throw (new.target + NEWI);
		}

		super(msg);
	}

}

export class TemplateError extends CydranError {

	constructor(msg: string) {
		if (!new.target) {
			throw (new.target + NEWI);
		}

		super(msg);
	}

}

export class RegistrationError extends CydranError {
  constructor(msg: string) {
    if (!new.target) throw (new.target + NEWI);
    super(msg);
  }
}
