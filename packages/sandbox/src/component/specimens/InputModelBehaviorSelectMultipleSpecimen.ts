/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./InputModelBehaviorSelectMultipleSpecimen.html";

/**
 * Specimen: two-way `c-model` on `<select multiple>` (`MultiSelectValueModelBehavior`,
 * multiple path). The model field holds an **array** of the selected option values.
 */
class InputModelBehaviorSelectMultipleSpecimen extends Component {

	private choices: string[];

	constructor() {
		super(TEMPLATE);
		this.choices = ["green"];
	}

	public setRedBlue(): void {
		this.choices = ["red", "blue"];
	}

	public clear(): void {
		this.choices = [];
	}

}

export default InputModelBehaviorSelectMultipleSpecimen;
