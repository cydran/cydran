import AbstractBehavior from "behavior/AbstractBehavior";
import { BEHAVIOR_FORM_RESET } from "const/HardValues";
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
		// tslint:disable-next-line
		for (let i = 0; i < this.getEl().elements.length; i++) {
			this.notifyElement(BEHAVIOR_FORM_RESET, {}, this.getEl().elements[i] as HTMLElement);
		}
	}

}

export default FormBehavior;
