import { asString } from "util/AsFunctions";
import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import AbstractBehavior from "behavior/AbstractBehavior";

class IdBehavior extends AbstractBehavior<string, HTMLElement, any> {

	constructor() {
		super();
		this.setReducerFn(asString);

	}

	public onInit(): void {
		this.getParent().tell("addNamedElement", {
			name: this.getExpression(),
			element: this.getEl()
		});
	}

}

BehaviorsRegistry.register("id", ["*"], IdBehavior);

export default IdBehavior;
