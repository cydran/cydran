import {Decorator} from "../../Core";

class BlurDecorator extends Decorator<Function> {

	public wire(): void {
		this.consume("blur");
		this.listenTo("dom", "blur", this.handleBlur);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleBlur(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default BlurDecorator;
