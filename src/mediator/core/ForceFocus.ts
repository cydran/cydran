import AbstractElementMediator from "mediator/AbstractElementMediator";
import { asBoolean } from "util/AsFunctions";
import { DOM_KEY } from "Constants";
import Validators from "validator/Validators";
import Events from "const/EventsFields";
import { INTERNAL_CHANNEL_NAME } from "Constants";
import Factories from "internals/Factories";

class ForceFocus extends AbstractElementMediator<boolean, HTMLElement, any> {
	private shouldFocus: boolean;

	constructor(deps: any) {
		super(deps, false, asBoolean);
	}

	public wire(): void {
		this.bridge("focusout");
		this.on("focusout").forChannel(DOM_KEY).invoke(this.handleFocus);
		this.on(Events.COMPONENT_NESTING_CHANGED)
			.forChannel(INTERNAL_CHANNEL_NAME)
			.invoke(this.handleFocus);
		this.shouldFocus = this.getModelMediator().get();

		if (this.isMutable()) {
			this.getModelMediator().watch(this, this.onTargetChange);
		}

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

	protected validate(
		element: HTMLElement,
		check: (name: string, value?: any) => Validators
	): void {
		// Intentionally do nothing
	}
}

Factories.register("force-focus", ["*"], ForceFocus);

export default ForceFocus;
