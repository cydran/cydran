import { InvalidStateError, ValidationError } from "error/Errors";
import Builder from "pattern/Builder";
import { requireNotNull, isDefined } from 'util/Utils';

abstract class AbstractBuilderImpl<T,I extends T> implements Builder<T> {

	private instance: I;

	constructor(instance: I) {
		this.instance = requireNotNull(instance, "instance");
	}

	public build(): T {
		if (!isDefined(this.instance)) {
			throw new InvalidStateError("Already built");
		}

		const errors: string[] = [];
		this.validate((message: string) => errors.push(message));

		if (errors.length > 0) {
			let messages: string = "Validation Errors: ";

			for (const message of errors) {
				messages += ", ";
				messages += message;
			}

			throw new ValidationError(messages);
		}

		const built: T = this.instance as T;
		this.instance = null;

		return built;
	}

	protected getInstance(): I {
		return this.instance;
	}

	protected abstract validate(reportError: (message: string) => void): void;

}

export default AbstractBuilderImpl;
