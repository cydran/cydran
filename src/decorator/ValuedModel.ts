import {Decorator} from "../Core";

/**
 *
 */
class ValuedModel extends Decorator<Function> {

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
		const value: string = event.target["value"];
		this.getMediator().set(value);
		this.notifyModelInteraction();
	}

	protected onTargetChange(previous: any, current: any): void {
		this.getEl()["value"] = current;
	}

}

export default ValuedModel;
