import {Decorator} from "../../../Core";

class ScrollElementDecorator extends Decorator<any> {

	public wire(): void {
		this.consume("scroll");
		this.listenTo("dom", "scroll", this.handleScroll);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleScroll(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default ScrollElementDecorator;
