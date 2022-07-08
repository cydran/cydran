import { asString } from "util/AsFunctions";
import AbstractBehavior from "behavior/AbstractBehavior";

class IdBehavior extends AbstractBehavior<string, HTMLElement, any> {

	constructor() {
		super();
		this.setReducerFn(asString);

	}

	public onInit(): void {
		this.getParent().$c().tell("addNamedElement", {
			name: this.getExpression(),
			element: this.getEl()
		});
	}

}

export default IdBehavior;
