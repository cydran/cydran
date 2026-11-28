/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./TextBehaviorSpecimen.html";

/**
 * Specimen: `TextBehavior` interpolates text nodes. `{{ expr }}` is reactive (watched);
 * `[[ expr ]]` is immutable (set once at mount). Also demonstrates non-string values,
 * expressions, and multiple interpolations in a single text node.
 */
class TextBehaviorSpecimen extends Component {

	private name: string;

	private count: number;

	constructor() {
		super(TEMPLATE);
		this.name = "Ada";
		this.count = 3;
	}

	public rename(): void {
		this.name = "Grace";
	}

	public increment(): void {
		this.count = this.count + 1;
	}

}

export default TextBehaviorSpecimen;
