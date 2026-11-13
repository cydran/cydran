/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

class ComponentStylesElement extends HTMLElement {

	constructor() {
		super();
	}

	public connectedCallback() {
		// Called when the element is inserted into the DOM
		// You can initialize the component here
	}

	public disconnectedCallback() {
		// Called when the element is removed from the DOM
		// You can clean up any resources or event listeners here
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public attributeChangedCallback(name: string, oldValue: unknown, newValue: unknown) {
		// Called when one of the element's attributes is added, removed, or changed
		// You can handle attribute changes here
	}

	static get observedAttributes() {
		// Specify which attributes you want to observe for changes
		return [];
	}
}

export default ComponentStylesElement;
