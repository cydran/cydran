import ObjectUtils from "@/ObjectUtils";
import ElementMediator from "@/mediator/ElementMediator";

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
		const replacement: string = ObjectUtils.encodeHtml(current);
		this.getEl().textContent = replacement;
	}

}

export default TextElementMediator;
