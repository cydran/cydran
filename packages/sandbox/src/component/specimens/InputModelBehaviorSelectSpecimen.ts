/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./InputModelBehaviorSelectSpecimen.html";

/**
 * Specimen: two-way `c-model` on a single `<select>` (`MultiSelectValueModelBehavior`,
 * non-multiple path). The model field holds the selected option's string value.
 */
class InputModelBehaviorSelectSpecimen extends Component {

	private choice: string;

	constructor() {
		super(TEMPLATE);
		this.choice = "green";
	}

	public pickBlue(): void {
		this.choice = "blue";
	}

}

export default InputModelBehaviorSelectSpecimen;
