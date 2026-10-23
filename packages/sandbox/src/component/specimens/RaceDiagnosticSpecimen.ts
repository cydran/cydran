/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./RaceDiagnosticSpecimen.html";

/**
 * Specimen: two behaviors on the same input — `c-model` (ValuedModelBehavior) and `c-oninput`
 * (EventBehavior) — both listening to the same `input` event. `bumps` witnesses that the event
 * reached Cydran; `value` shows whether c-model propagated it. A mismatch (bumps > 0, value
 * unchanged) is the cydran/cydran#825 drop.
 */
class RaceDiagnosticSpecimen extends Component {

	private value: string;

	private bumps: number;

	constructor() {
		super(TEMPLATE);
		this.value = "initial";
		this.bumps = 0;
	}

	public bump(): void {
		this.bumps++;
	}

}

export default RaceDiagnosticSpecimen;
