import {Decorator} from "../Core";

class ValuedModelElementDecorator extends Decorator<any> {

	private listener: EventListenerOrEventListenerObject;

	public wire(): void {
		this.listener = (event) => this.handle(event);
		this.getEl().addEventListener("input", this.listener, false);
		const value = this.getMediator().get();
		this.getEl()["value"] = value;
		this.getMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		this.getEl().removeEventListener("input", this.listener);
		this.listener = null;
	}

	public handle(event: Event): void {
		this.getMediator().set(event.target["value"]);
		this.notifyModelInteraction();
	}

	protected onTargetChange(previous: any, current: any): void {
		this.getEl()["value"] = current;
	}

}

export default ValuedModelElementDecorator;