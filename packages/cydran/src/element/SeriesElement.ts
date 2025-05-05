import { isDefined } from "util/Utils";

class SeriesElement extends HTMLElement {

	constructor() {
		super();
	}

	public connectedCallback() {
		// Intentionally empty
	}

	public disconnectedCallback() {
		// Intentionally empty
	}

	public attributeChangedCallback(name: string, oldValue: unknown, newValue: unknown) {
		// Intentionally empty
	}

	static get observedAttributes() {
		return [];
	}
}

export default SeriesElement;
