/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./InputModelBehaviorColorSpecimen.html";

/**
 * Specimen: two-way `c-model` on `<input type="color">`.
 *
 * Uses the STRING accessor strategy (`el.value`), but the value is a `#rrggbb` string
 * that the browser normalizes to lowercase. `green()`/`black()` mutate the model to
 * exercise the model -> DOM path.
 */
class InputModelBehaviorColorSpecimen extends Component {

	private value: string;

	constructor() {
		super(TEMPLATE);
		this.value = "#3366ff";
	}

	public green(): void {
		this.value = "#00ff00";
	}

	public black(): void {
		this.value = "#000000";
	}

}

export default InputModelBehaviorColorSpecimen;
