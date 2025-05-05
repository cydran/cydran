import AbstractBehavior from "behavior/AbstractBehavior";

class ValidatedBehavior extends AbstractBehavior<string, HTMLElement, unknown> {

	constructor() {
		super();
		this.setDefaultExpression("");
		this.setFlag("EXPRESSION_DISALLOWED");
	}

	public onMount(): void {
		// TODO - Implement
	}

}

export default ValidatedBehavior;
