import AbstractBehavior from "behavior/AbstractBehavior";

class ValidatedBehavior extends AbstractBehavior<string, HTMLElement, any> {

	constructor() {
		super();
		this.setDefaultExpression("");
		this.setFlag("EXPRESSION_DISALLOWED");
	}

	public onNotification(topic: string, payload: any): void {
		this.getLogger().debug("validation will fire here for: " + payload);
	}

	public onMount(): void {
		// TODO - Implement
	}

}

export default ValidatedBehavior;
