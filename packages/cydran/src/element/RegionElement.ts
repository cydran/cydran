/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

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
