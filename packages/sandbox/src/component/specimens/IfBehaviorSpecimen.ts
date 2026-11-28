/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./IfBehaviorSpecimen.html";

/**
 * Specimen: `c-if` conditionally attaches/detaches an element from the DOM.
 * When the expression is falsy the element is removed (replaced by a comment
 * placeholder); when truthy it is re-inserted.
 */
class IfBehaviorSpecimen extends Component {

	private visible: boolean;

	constructor() {
		super(TEMPLATE);
		this.visible = true;
	}

	public toggle(): void {
		this.visible = !this.visible;
	}

}

export default IfBehaviorSpecimen;
