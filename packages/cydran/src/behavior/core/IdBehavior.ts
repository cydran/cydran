/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { asString } from "util/AsFunctions";
import AbstractBehavior from "behavior/AbstractBehavior";

class IdBehavior extends AbstractBehavior<string, HTMLElement, unknown> {

	constructor() {
		super();
		this.setReducerFn(asString);

	}

	public onInit(): void {
		this.getTargetComponent().$c().tell("addNamedElement", {
			name: this.getExpression(),
			element: this.getEl()
		});
	}

}

export default IdBehavior;
