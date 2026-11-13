/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component, isDefined } from "@cydran/cydran";
import TEMPLATE from "./WebComponentExample.html";
import WEB_COMPONENT_TEMPLATE from "./WebComponentTemplate.html";

class WebComponentExample extends Component {

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

export default WebComponentExample;
