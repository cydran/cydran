import { asString } from "util/AsFunctions";
import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import AbstractBehavior from "behavior/AbstractBehavior";

class Id extends AbstractBehavior<string, HTMLElement, any> {

	constructor() {
		super(asString);
	}

	public onInit(): void {
		this.getParent().tell("addNamedElement", {
			name: this.getExpression(),
			element: this.getEl()
		});
	}

}

BehaviorsRegistry.register("id", ["*"], Id);

export default Id;
