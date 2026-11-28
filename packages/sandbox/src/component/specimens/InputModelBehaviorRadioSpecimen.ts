/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./InputModelBehaviorRadioSpecimen.html";

/**
 * Specimen: two-way `c-model` on a radio group (`RadioModelBehavior`). Every radio shares
 * `c-model="m().size"`; checking one sets the model to its value, and setting the model
 * checks the radio whose value matches.
 */
class InputModelBehaviorRadioSpecimen extends Component {

	private size: string;

	constructor() {
		super(TEMPLATE);
		this.size = "medium";
	}

	public pickLarge(): void {
		this.size = "large";
	}

}

export default InputModelBehaviorRadioSpecimen;
