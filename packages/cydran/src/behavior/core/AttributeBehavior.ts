import AbstractBehavior from "behavior/AbstractBehavior";
import { asString } from "util/AsFunctions";
import { requireNotNull } from 'util/Utils';

class AttributeBehavior extends AbstractBehavior<string, HTMLElement, unknown> {

	private attributeName: string;

	constructor(attributeName: string) {
		super();
		this.setReducerFn(asString);
		this.attributeName = requireNotNull(attributeName, "attributeName");
	}

	public onMount(): void {
		this.getEl().setAttribute(this.attributeName, this.getMediator().get());

		if (this.isMutable()) {
			this.getMediator().watch(this, this.onChange);
		}
	}

	protected onChange(previous: string, current: string): void {
		this.getEl().setAttribute(this.attributeName, current);
	}

}

export default AttributeBehavior;
