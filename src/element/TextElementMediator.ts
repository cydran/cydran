import ElementMediator from "@/element/ElementMediator";
import { asString } from "@/model/Reducers";

class TextElementMediator extends ElementMediator<string, Text, any> {

	constructor(dependencies: any) {
		super(dependencies, false, asString);
	}

	public wire(): void {
		this.getModelMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: any, current: any): void {
		this.getEl().textContent = current;
	}

}

export default TextElementMediator;
