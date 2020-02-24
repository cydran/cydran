import ElementMediator from "@/element/ElementMediator";
import Properties from "@/config/Properties";
import Factories from "@/mvvm/Factories";

/**
 *
 */
class If extends ElementMediator<boolean, HTMLElement, any> {

	private comment: Comment;

	private initialized: boolean = false;

	public wire(): void {
		this.comment = Properties.getWindow().document.createComment(" hidden ");
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
