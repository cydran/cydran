import AbstractElementMediator from "mediator/AbstractElementMediator";
import { asString } from "util/AsFunctions";

class TextElementMediator extends AbstractElementMediator<string, Text, any> {

	constructor() {
		super(asString);
	}

	public populate(): void {
		this.getEl().textContent = this.getModelMediator().get();
	}

	public onMount(): void {
		if (this.isMutable()) {
			this.getModelMediator().watch(this, this.onTargetChange);
		}
	}

	protected onTargetChange(previous: any, current: any): void {
		this.getEl().textContent = current;
	}

}

export default TextElementMediator;