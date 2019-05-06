import {Decorator} from "../Core";

class ValuedModelElementDecorator extends Decorator<any> {

	public wire(): void {
		this.consume("input");
		this.listenTo("dom", "input", this.handleInput);
		const value = this.getMediator().get();
		this.getEl()["value"] = value;
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

export default ValuedModelElementDecorator;
