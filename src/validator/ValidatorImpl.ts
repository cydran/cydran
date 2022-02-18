import FieldValidations from "validator/FieldValidations";
import { isDefined } from "util/Utils";
import Validator from "validator/Validator";

class ValidatorImpl<T,C> implements Validator<T,C> {

	private validations: FieldValidations<C>;

	constructor() {
		this.validations = {};
	}

	public validate(values: T, context?: C, prefix: string = ""): string[] {
		const errors: string[] = [];

		for (const key in this.validations) {
			if (!this.validations.hasOwnProperty(key)) {
				continue;
			}

			const value: any = values[key];

			this.validateValue(prefix, key, value, values, context, errors);
		}

		return errors;
	}

	private validateValue(prefix: string, key: string, value: any, instance: any, context: C, errors: string[]): void {
		const validations: ((field: any, instance: any, context: C) => string)[] = this.validations[key];

		for (const validation of validations) {
			const message: string = validation(value, instance, context);

			if (isDefined(message)) {
				const error: string = `${prefix}${key} ${message}`;
				errors.push(error);
			}
		}
	}

	public setValidations(validations: FieldValidations<C>): void {
		this.validations = isDefined(validations) ? validations : {};
	}

}

export default ValidatorImpl;
