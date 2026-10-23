/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./RequiredBehaviorSpecimen.html";

/**
 * Specimen: `c-required` sets the element's `required` property from a boolean expression.
 */
class RequiredBehaviorSpecimen extends Component {

	private required: boolean;

	constructor() {
		super(TEMPLATE);
		this.required = false;
	}

	public toggle(): void {
		this.required = !this.required;
	}

}

export default RequiredBehaviorSpecimen;
