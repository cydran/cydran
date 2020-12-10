import AbstractBehavior from "behavior/AbstractBehavior";
import { asString } from "util/AsFunctions";

class AttributeBehavior extends AbstractBehavior<string, HTMLElement, any> {

	private attributeName: string;

	constructor() {
		super();
		this.setReducerFn(asString);
	}

	public onMount(): void {
		this.getEl().setAttribute(this.attributeName, this.getMediator().get());

		if (this.isMutable()) {
			this.getMediator().watch(this, this.onTargetChange);
		}
	}

	public setAttributeName(attributeName: string): void {
		this.attributeName = attributeName;
	}

	protected onTargetChange(previous: string, current: string): void {
		this.getEl().setAttribute(this.attributeName, current);
	}

}

export default AttributeBehavior;
