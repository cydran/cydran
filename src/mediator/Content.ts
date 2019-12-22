import { ElementMediator } from "@/Core";
import ObjectUtils from "@/ObjectUtils";

class Content extends ElementMediator<string, HTMLElement> {

	public static readonly KEY: string = "content";

	public wire(): void {
		this.getModelMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: string, current: string): void {
		this.getEl().innerHTML = ObjectUtils.encodeHtml(current);
	}

}

export default Content;
