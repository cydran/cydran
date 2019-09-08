import {Decorator} from "../../Core";

class DblClickElementDecorator extends Decorator<any> {

	public wire(): void {
		this.consume("dblclick");
		this.listenTo("dom", "dblclick", this.handleDblClick);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleDblClick(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default DblClickElementDecorator;
