import {Decorator} from "../Core";

class ClickElementDecorator extends Decorator<any> {

	public wire(): void {
		this.getEl().addEventListener("click", (event) => this.handleClick(event), false);
	}

	public unwire(): void {
		this.getEl().removeEventListener("click", (event) => this.handleClick(event));
	}

	public handleClick(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

}

export default ClickElementDecorator;