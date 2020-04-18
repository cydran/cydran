import ElementMediator from "@/element/ElementMediator";
import { asString } from "@/model/Reducers";

class AttributeElementMediator extends ElementMediator<string, HTMLElement, any> {

	private attributeName: string;

	constructor(dependencies: any) {
		super(dependencies, false, asString);
	}

	public wire(): void {
		this.getModelMediator().watch(this, this.onTargetChange);
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

}

export default AttributeElementMediator;
