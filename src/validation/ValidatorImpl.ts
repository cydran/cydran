import UndefinedValidatorsImpl from "@/validation/UndefinedValidatorsImpl";
import ValidationError from "@/error/ValidationError";
import DefinedValidatorsImpl from "@/validation/DefinedValidatorsImpl";
import { isDefined } from "@/util/ObjectUtils";
import Validators from "@/validation/Validators";
import Validator from "@/validation/Validator";

class ValidatorImpl implements Validator {

	private errors: string[];

	constructor() {
		this.errors = [];
	}

	public getFunction(): (name: string, value?: any) => Validators {
		const consumer: (error: string) => void = (error: string) => this.errors.push(error);
		return (name: string, value: any) => isDefined(value)
			? new DefinedValidatorsImpl(name, value, consumer)
			: new UndefinedValidatorsImpl(name, value, consumer);
	}

	public throwIfErrors(prefixFn: () => string): void {
		if (this.errors.length > 0) {
			let message: string = prefixFn() + "\n\nDetails:\n";

			for (const error of this.errors) {
				message += "\n    - " + error;
			}

			message += "\n";

			throw new ValidationError(message);
		}
	}

}

export default ValidatorImpl;
