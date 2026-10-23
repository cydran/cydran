/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./IdBehaviorSpecimen.html";

/**
 * Specimen: `c-id` registers an element under a name (here "myField") so it can be
 * reached programmatically via `$c().forElement(name)`. Note that `c-id` does NOT set
 * the DOM `id` attribute — it is a named-element registration for `ElementOperations`.
 */
class IdBehaviorSpecimen extends Component {

	constructor() {
		super(TEMPLATE);
	}

	public focusField(): void {
		this.$c().forElement("myField").focus();
	}

	public blurField(): void {
		this.$c().forElement("myField").blur();
	}

}

export default IdBehaviorSpecimen;
