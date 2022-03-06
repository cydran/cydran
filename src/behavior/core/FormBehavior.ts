import AbstractBehavior from "behavior/AbstractBehavior";
import { RESET_KEY, DOM_KEY } from "Constants";

class FormBehavior extends AbstractBehavior<string, HTMLFormElement, any> {

	constructor() {
		super();
		this.setDefaultExpression("");
		this.setFlag("EXPRESSION_DISALLOWED");
	}

	public onInit(): void {
		this.bridge(RESET_KEY);
		this.on(RESET_KEY).forChannel(DOM_KEY).invoke(this.onReset);
	}

	private onReset(event: Event): void {
		// TODO - Implement
	}

}

export default FormBehavior;
