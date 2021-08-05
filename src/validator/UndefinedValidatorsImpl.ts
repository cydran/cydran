import Validators from "validator/Validators";

export class UndefinedValidatorsImpl implements Validators {

	private name: string;

	private value: any;

	private consumer: (error: string) => void;

	constructor(name: string, value: any, consumer: (error: string) => void) {
		this.name = name;
		this.value = value;
		this.consumer = consumer;
	}

	public matches(regex: RegExp): Validators {
		return this;
	}

	public isDefined(): Validators {
		this.consumer(`${this.name} must be defined`);

		return this;
	}

	public oneOf(...options: any[]): Validators {
		return this;
	}

	public requireIfDefined(name: string, requiredValue: any): Validators {
		return this;
	}

	public requireIfEquals(expected: any, name: string, requiredValue: any): Validators {
		return this;
	}

	public requireIfTrue(test: boolean): Validators {
		if (test) {
			this.consumer(`${this.name} must be defined if ${this.name}`);
		}

		return this;
	}

	public disallowIfTrue(test: boolean, message: string): Validators {
		return this;
	}

	public notEmpty(): Validators {
		return this;
	}

	public reject(message: string): Validators {
		this.consumer(`${this.name} ${message}`);

		return this;
	}

}

export default UndefinedValidatorsImpl;
