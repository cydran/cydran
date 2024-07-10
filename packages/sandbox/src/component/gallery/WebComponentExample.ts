import { Component, isDefined } from "@cydran/cydran";
import TEMPLATE from "./WebComponentExample.html";
import WEB_COMPONENT_TEMPLATE from "./WebComponentTemplate.html";

class WebComponent extends Component {

	private value: string;

	constructor() {
		super(TEMPLATE);
		this.value = "Hello World";
	}

}

class ExampleCard extends HTMLElement {

	constructor() {
		super();
		const shadow = this.attachShadow({mode: 'open'});
		const template = document.createElement('template');
		template.innerHTML = WEB_COMPONENT_TEMPLATE;
		shadow.appendChild(template.content.cloneNode(true));
	}

}

if (!isDefined(customElements.get("example-card"))) {
	customElements.define("example-card", ExampleCard);
}

export default WebComponent;
