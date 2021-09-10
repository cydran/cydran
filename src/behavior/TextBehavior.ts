import AbstractBehavior from "behavior/AbstractBehavior";
import { asString } from "util/AsFunctions";

class TextBehavior extends AbstractBehavior<string, Text, any> {

	constructor() {
		super(asString);
	}

	public onMount(): void {
		this.getEl().textContent = this.getMediator().get();

		if (this.isMutable()) {
			this.getMediator().watch(this, this.onTargetChange);
		}
	}

	protected onTargetChange(previous: any, current: any): void {
		this.getEl().textContent = current;
	}

}

export default TextBehavior;