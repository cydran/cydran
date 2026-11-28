/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./HiddenBehaviorSpecimen.html";

/**
 * Specimen: `c-hidden` toggles the element's `hidden` property from a boolean
 * expression. The element remains in the DOM but is visually hidden.
 */
class HiddenBehaviorSpecimen extends Component {

	private hidden: boolean;

	constructor() {
		super(TEMPLATE);
		this.hidden = false;
	}

	public toggle(): void {
		this.hidden = !this.hidden;
	}

}

export default HiddenBehaviorSpecimen;
