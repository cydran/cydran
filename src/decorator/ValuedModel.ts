import {Decorator} from "../Core";

/**
 *
 */
class ValuedModel extends Decorator<string, HTMLInputElement> {

	public static readonly KEY: string = "model";

	public wire(): void {
		this.bridge("input");
		this.listenTo("dom", "input", this.handleInput);
		this.getMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleInput(event: Event): void {
		this.getMediator().set(this.getEl().value);
		this.notifyModelInteraction();
	}

	protected onTargetChange(previous: string, current: string): void {
		this.getEl().value = current;
	}

}

export default ValuedModel;
