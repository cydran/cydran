import FieldValidations from "validator/FieldValidations";
import { isDefined } from "util/Utils";
import Validator from "validator/Validator";

class ValidatorImpl<T,S> implements Validator<T,S> {

	private validations: FieldValidations<S>;

	constructor() {
		this.validations = {};
	}

	public validate(values: T, state?: S, prefix: string = ""): string[] {
		const errors: string[] = [];

		for (const key of Object.keys(this.validations)) {
			const value: unknown = values[key];
			this.validateValue(prefix, key, value, values, state, errors);
		}

		return errors;
	}

	private validateValue(prefix: string, key: string, value: unknown, instance: unknown, state: S, errors: string[]): void {
		const validations: ((field: unknown, instance: unknown, state: S) => string)[] = this.validations[key];

		for (const validation of validations) {
			const message: string = validation(value, instance, state);

			if (isDefined(message)) {
				const error: string = `${prefix}${key} ${message}`;
				errors.push(error);
			}
		}
	}

	public setValidations(validations: FieldValidations<S>): void {
		this.validations = isDefined(validations) ? validations : {};
	}

	public getNames(): string[] {
		return Object.keys(this.validations);
	}

}

export default ValidatorImpl;
