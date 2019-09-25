import {Decorator} from "../../../Core";

class AuxClickElementDecorator extends Decorator<any> {

	public wire(): void {
		this.consume("auxclick");
		this.listenTo("dom", "auxclick", this.handleAuxClick);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleAuxClick(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default AuxClickElementDecorator;
