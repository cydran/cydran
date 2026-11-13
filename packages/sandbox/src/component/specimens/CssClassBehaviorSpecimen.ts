/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./CssClassBehaviorSpecimen.html";

/**
 * Specimen: `c-class` toggles CSS classes from an object map while preserving
 * classes not named in the map (here `tag` and `base-class`).
 */
class CssClassBehaviorSpecimen extends Component {

	private active: boolean;

	private danger: boolean;

	constructor() {
		super(TEMPLATE);
		this.active = false;
		this.danger = false;
	}

	public toggleActive(): void {
		this.active = !this.active;
	}

	public toggleDanger(): void {
		this.danger = !this.danger;
	}

}

export default CssClassBehaviorSpecimen;
