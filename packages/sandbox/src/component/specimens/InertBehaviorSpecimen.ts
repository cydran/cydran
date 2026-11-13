/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./InertBehaviorSpecimen.html";

/**
 * Specimen: `c-inert` sets the element's `inert` property from a boolean expression.
 */
class InertBehaviorSpecimen extends Component {

	private inert: boolean;

	constructor() {
		super(TEMPLATE);
		this.inert = false;
	}

	public toggle(): void {
		this.inert = !this.inert;
	}

}

export default InertBehaviorSpecimen;
