import {Decorator} from "../../../Core";

class WheelElementDecorator extends Decorator<any> {

	public wire(): void {
		this.consume("wheel");
		this.listenTo("dom", "wheel", this.handleWheel);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleWheel(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default WheelElementDecorator;
