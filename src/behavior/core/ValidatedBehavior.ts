import AbstractBehavior from "behavior/AbstractBehavior";
import BehaviorsRegistry from "behavior/BehaviorsRegistry";

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

BehaviorsRegistry.register("validated", ["*"], ValidatedBehavior);

export default ValidatedBehavior;
