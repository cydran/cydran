import ElementMediator from "@/element/ElementMediator";
import { INTERNAL_CHANNEL_NAME } from "@/constant/Constants";
import Events from "@/constant/Events";
import Factories from "@/mvvm/Factories";
import { asBoolean } from "@/model/Reducers";
import Validators from "@/validation/Validators";

class ForceFocus extends ElementMediator<boolean, HTMLElement, any> {

	private shouldFocus: boolean;

	constructor(deps: any) {
		super(deps, false, asBoolean);
	}

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

	protected validate(element: HTMLElement, check: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing
	}

}

Factories.register("force-focus", ["*"], ForceFocus);

export default ForceFocus;
