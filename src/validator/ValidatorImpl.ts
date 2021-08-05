import Validator from "validator/Validator";
import Validators from "validator/Validators";
import DefinedValidatorsImpl from "validator/DefinedValidatorsImpl";
import UndefinedValidatorsImpl from "validator/UndefinedValidatorsImpl";
import { isDefined } from "util/Utils";
import { ValidationError } from 'error/Errors';

class ValidatorImpl implements Validator {

	private errors: string[];

	constructor() {
		this.errors = [];
	}

	public getFunction(): (name: string, value?: any) => Validators {
		const consumer: (error: string) => void = (error: string) => this.errors.push(error);
		return (name: string, value: any) =>
			isDefined(value)
				? new DefinedValidatorsImpl(name, value, consumer)
				: new UndefinedValidatorsImpl(name, value, consumer);
	}

	public throwIfErrors(prefixFn: () => string): void {
		if (this.errors.length > 0) {
			let message: string = `${ prefixFn() }\n\nDetails:\n`;

			for (const error of this.errors) {
				message += `\n    - ${ error }`;
			}

			throw new ValidationError(`${ message }\n`);
		}
	}

}

export default ValidatorImpl;
