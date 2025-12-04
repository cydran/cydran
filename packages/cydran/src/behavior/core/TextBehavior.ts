import AbstractBehavior from "behavior/AbstractBehavior";
import { asString } from "util/AsFunctions";

class TextBehavior extends AbstractBehavior<string, Text, unknown> {

	constructor() {
		super();
		this.setReducerFn(asString);
	}

	public onMount(): void {
		this.getEl().textContent = this.getMediator().get();

		if (this.isMutable()) {
			this.getMediator().watch(this, this.onChange);
		}
	}

	protected onChange(previous: string, current: string): void {
		this.getEl().textContent = current;
	}

}

export default TextBehavior;