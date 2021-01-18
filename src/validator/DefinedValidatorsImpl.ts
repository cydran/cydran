import Validators from "validator/Validators";
import { isDefined } from "util/Utils";

class DefinedValidatorsImpl implements Validators {
	private name: string;

	private value: any;

	private consumer: (error: string) => void;

	constructor(name: string, value: any, consumer: (error: string) => void) {
		this.name = name;
		this.value = value;
		this.consumer = consumer;
	}

	public matches(regex: RegExp): Validators {
		if (!regex.test(this.value + "")) {
			this.consumer(` ${this.name} must match ${regex}`);
		}

		return this;
	}

	public isDefined(): Validators {
		return this;
	}

	public oneOf(...options: any[]): Validators {
		let invalid: boolean = true;

		for (const option of options) {
			if (this.value === option) {
				invalid = false;
				break;
			}
		}

		if (invalid) {
			let message: string = `${this.name} must be one of: `;

			let afterFirst: boolean = false;

			for (const option of options) {
				if (afterFirst) {
					message += ", ";
				}

				message += option;
				afterFirst = true;
			}

			this.consumer(message);
		}

		return this;
	}

	public requireIfDefined(name: string, requiredValue: any): Validators {
		if (!isDefined(requiredValue)) {
			this.consumer(`${name} must be defined if ${this.name} is defined`);
		}

		return this;
	}

	public requireIfEquals(expected: any, name: string, requiredValue: any): Validators {
		if (this.value === expected && !isDefined(requiredValue)) {
			this.consumer(`${name} must be defined if ${this.name} is ${expected}`);
		}

		return this;
	}

	public requireIfTrue(test: boolean): Validators {
		return this;
	}

	public disallowIfTrue(test: boolean, message: string): Validators {
		if (test) {
			this.consumer(`${this.name} must not be defined ${message}`);
		}

		return this;
	}

	public notEmpty(): Validators {
		if ((this.value + "").trim() === "") {
			this.consumer(`${this.name} must not be empty`);
		}

		return this;
	}

	public reject(message: string): Validators {
		this.consumer(`${this.name} ${message}`);

		return this;
	}
}

export default DefinedValidatorsImpl;
