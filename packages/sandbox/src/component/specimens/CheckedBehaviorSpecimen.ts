/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./CheckedBehaviorSpecimen.html";

/**
 * Specimen: `c-checked` two-way binds a checkbox to a boolean model field. Clicking the
 * checkbox updates `checked` (DOM -> model); `toggle()` mutates the model (model -> DOM).
 */
class CheckedBehaviorSpecimen extends Component {

	private checked: boolean;

	constructor() {
		super(TEMPLATE);
		this.checked = false;
	}

	public toggle(): void {
		this.checked = !this.checked;
	}

}

export default CheckedBehaviorSpecimen;
