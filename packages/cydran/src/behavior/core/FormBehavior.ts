import AbstractBehavior from "behavior/AbstractBehavior";
import { RESET_KEY, DOM_KEY, BEHAVIOR_FORM_RESET } from "CydranConstants";

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
		// eslint:disable-next-line
		for (let i = 0; i < this.getEl().elements.length; i++) {
			this.notifyElement(BEHAVIOR_FORM_RESET, {}, this.getEl().elements[i] as HTMLElement);
		}
	}

}

export default FormBehavior;
