import ElementMediator from "@/element/ElementMediator";
import Factories from "@/mvvm/Factories";
import { asBoolean } from "@/model/Reducers";
import { createCommentOffDom } from "@/util/DomUtils";

/**
 *
 */
class If extends ElementMediator<boolean, HTMLElement, any> {

	private comment: Comment;

	private initialized: boolean = false;

	constructor(deps: any) {
		super(deps, false, asBoolean);
	}

	public wire(): void {
		this.comment = createCommentOffDom(" hidden ");
		this.getModelMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		if (this.initialized) {
			const activeEl: any = current ? this.comment : this.getEl();
			activeEl.parentElement.replaceChild((current ? this.getEl() : this.comment) as HTMLElement, activeEl as HTMLElement);
		} else {
			if (!current) {
				this.getEl().parentElement.replaceChild((this.comment as any) as HTMLElement, this.getEl());
			}

			this.initialized = true;
		}
	}

}

Factories.register("if", ["*"], If);

export default If;
