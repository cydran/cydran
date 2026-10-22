import { Component } from "@cydran/cydran";
import TEMPLATE from "./AttributeBehaviorSpecimen.html";

/**
 * Specimen: `AttributeBehavior` binds a plain HTML attribute to a model expression by
 * wrapping the attribute value in `{{ }}` (reactive) or `[[ ]]` (immutable). Here the
 * `title` attribute is bound both ways.
 */
class AttributeBehaviorSpecimen extends Component {

	private title: string;

	constructor() {
		super(TEMPLATE);
		this.title = "initial title";
	}

	public change(): void {
		this.title = "changed title";
	}

}

export default AttributeBehaviorSpecimen;
