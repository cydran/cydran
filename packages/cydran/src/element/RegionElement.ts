import { isDefined } from "util/Utils";

class RegionElement extends HTMLElement {

	constructor() {
		super();
	}

	public connectedCallback() {
		// Intentionally empty
	}

	public disconnectedCallback() {
		// Intentionally empty
	}

	public attributeChangedCallback(name: string, oldValue: any, newValue: any) {
		// Intentionally empty
	}

	static get observedAttributes() {
		return [];
	}
}

export default RegionElement;
