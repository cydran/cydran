import ElementMediator from "@/element/ElementMediator";

class TextElementMediator extends ElementMediator<string, Text, any> {

	constructor(dependencies: any) {
		super(dependencies, false);
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
