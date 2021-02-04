import Validators from "validator/Validators";
import AbstractElementMediator from "mediator/AbstractElementMediator";
import { asString } from "util/AsFunctions";

class AttributeElementMediator extends AbstractElementMediator<string, HTMLElement, any> {
	private attributeName: string;

	constructor(dependencies: any) {
		super(dependencies, false, asString);
	}

	public wire(): void {
		if (this.isMutable()) {
			this.getModelMediator().watch(this, this.onTargetChange);
		}
	}

	public populate(): void {
		this.getEl().setAttribute(this.attributeName, this.getModelMediator().get());
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public setAttributeName(attributeName: string): void {
		this.attributeName = attributeName;
	}

	protected onTargetChange(previous: string, current: string): void {
		this.getEl().setAttribute(this.attributeName, current);
	}

	protected validate(
		element: HTMLElement,
		check: (name: string, value?: any) => Validators
	): void {
		// Intentionally do nothing
	}
}

export default AttributeElementMediator;
