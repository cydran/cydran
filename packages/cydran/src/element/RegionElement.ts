import { isDefined } from "util/Utils";

class RegionElement extends HTMLElement {

	constructor() {
		super();
		// console.log("region webcomponent constructed");
	}

	public connectedCallback() {
		// Called when the element is inserted into the DOM
		// You can initialize the component here
	}

	public disconnectedCallback() {
		// Called when the element is removed from the DOM
		// You can clean up any resources or event listeners here
	}

	public attributeChangedCallback(name: string, oldValue: any, newValue: any) {
		// Called when one of the element's attributes is added, removed, or changed
		// You can handle attribute changes here
	}

	static get observedAttributes() {
		// Specify which attributes you want to observe for changes
		return [];
	}
}

export default RegionElement;
