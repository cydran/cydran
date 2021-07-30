import AbstractElementMediator from "mediator/AbstractElementMediator";
import { asString } from "util/AsFunctions";

class AttributeElementMediator extends AbstractElementMediator<string, HTMLElement, any> {

	private attributeName: string;

	constructor() {
		super(asString);
	}

	public onMount(): void {
		if (this.isMutable()) {
			this.getModelMediator().watch(this, this.onTargetChange);
		}
	}

	public populate(): void {
		this.getEl().setAttribute(this.attributeName, this.getModelMediator().get());
	}

	public setAttributeName(attributeName: string): void {
		this.attributeName = attributeName;
	}

	protected onTargetChange(previous: string, current: string): void {
		this.getEl().setAttribute(this.attributeName, current);
	}

}

export default AttributeElementMediator;
