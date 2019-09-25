import {Decorator} from "../../../Core";

class ShowElementDecorator extends Decorator<any> {

	public wire(): void {
		this.consume("show");
		this.listenTo("dom", "show", this.handleShow);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleShow(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default ShowElementDecorator;
