/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./InputModelBehaviorRangeSpecimen.html";

/**
 * Specimen: two-way `c-model` on `<input type="range">`.
 *
 * Shares the NUMBER accessor strategy (`el.valueAsNumber`) with `number`, so `value`
 * is a real `number`. Range inputs are driven by dispatched `input` events in the test,
 * as a slider drag would emit.
 */
class InputModelBehaviorRangeSpecimen extends Component {

	private value: number;

	constructor() {
		super(TEMPLATE);
		this.value = 50;
	}

	public stamp(): void {
		this.value = 75;
	}

}

export default InputModelBehaviorRangeSpecimen;
