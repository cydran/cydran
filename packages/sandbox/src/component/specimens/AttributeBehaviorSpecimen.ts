/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./AttributeBehaviorSpecimen.html";

/**
 * Specimen: `AttributeBehavior` binds a plain HTML attribute to a model expression by
 * wrapping the attribute value in `{{ }}` (reactive) or `[[ ]]` (immutable). Here the
 * `title` attribute is bound both ways.
 */
class AttributeBehaviorSpecimen extends Component {

	private title: string;

	constructor() {
		super(TEMPLATE);
		this.title = "initial title";
	}

	public change(): void {
		this.title = "changed title";
	}

}

export default AttributeBehaviorSpecimen;
