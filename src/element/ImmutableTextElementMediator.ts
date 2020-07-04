import ElementMediator from "@/element/ElementMediator";
import { asString } from "@/model/Reducers";

class ImmutableTextElementMediator extends ElementMediator<string, Text, any> {

	constructor(dependencies: any) {
		super(dependencies, false, asString);
	}

	public wire(): void {
		this.getEl().textContent = this.getModelMediator().get();
	}

	public unwire(): void {
		// Intentionally do nothing
	}

}

export default ImmutableTextElementMediator;
