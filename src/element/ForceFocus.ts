import ElementMediator from "@/element/ElementMediator";
import { INTERNAL_CHANNEL_NAME } from "@/constant/Constants";
import Events from "@/constant/Events";
import Factories from "@/mvvm/Factories";

class ForceFocus extends ElementMediator<boolean, HTMLElement, any> {

	public static readonly KEY: string = "force-focus";

	private shouldFocus: boolean;

	public wire(): void {
		this.bridge("focusout");
		this.on("focusout").forChannel("dom").invoke(this.handleFocus);
		this.on(Events.COMPONENT_NESTING_CHANGED).forChannel(INTERNAL_CHANNEL_NAME).invoke(this.handleFocus);
		this.shouldFocus = this.getModelMediator().get();
		this.getModelMediator().watch(this, this.onTargetChange);
		this.handleFocus();
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleFocus(): void {
		if (this.shouldFocus) {
			this.getEl().focus();
		}
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.shouldFocus = current;
		this.handleFocus();
	}

}

Factories.register(ForceFocus.KEY, ["*"], ForceFocus);

export default ForceFocus;
