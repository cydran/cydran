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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public attributeChangedCallback(name: string, oldValue: unknown, newValue: unknown) {
		// Intentionally empty
	}

	static get observedAttributes() {
		return [];
	}
}

export default RegionElement;
