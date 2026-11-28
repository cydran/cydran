/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./ReadOnlyBehaviorSpecimen.html";

/**
 * Specimen: `c-readonly` sets the element's `readOnly` property from a boolean expression.
 * (Field is named `readOnly` because `readonly` is a TypeScript keyword.)
 */
class ReadOnlyBehaviorSpecimen extends Component {

	private readOnly: boolean;

	constructor() {
		super(TEMPLATE);
		this.readOnly = false;
	}

	public toggle(): void {
		this.readOnly = !this.readOnly;
	}

}

export default ReadOnlyBehaviorSpecimen;
