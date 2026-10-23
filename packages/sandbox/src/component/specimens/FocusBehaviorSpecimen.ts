/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./FocusBehaviorSpecimen.html";

/**
 * Specimen: `c-focus` focuses its element while `focused` is truthy, and re-focuses it on
 * `focusout` (focus trap). Setting `focused` false releases the trap.
 */
class FocusBehaviorSpecimen extends Component {

	private focused: boolean;

	constructor() {
		super(TEMPLATE);
		this.focused = false;
	}

	public toggle(): void {
		this.focused = !this.focused;
	}

}

export default FocusBehaviorSpecimen;
