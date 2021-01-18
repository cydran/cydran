import { AbstractElementMediator } from "mediator/AbstractElementMediator";
import Validators from "validator/Validators";
import { asString } from "util/AsFunctions";

class TextElementMediator extends AbstractElementMediator<string, Text, any> {
	constructor(dependencies: any) {
		super(dependencies, false, asString);
	}

	public populate(): void {
		this.getEl().textContent = this.getModelMediator().get();
	}

	public wire(): void {
		if (this.isMutable()) {
			this.getModelMediator().watch(this, this.onTargetChange);
		}
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: any, current: any): void {
		this.getEl().textContent = current;
	}

	protected validate(
		element: Text,
		check: (name: string, value?: any) => Validators
	): void {
		// Intentionally do nothing
	}
}

export default TextElementMediator;