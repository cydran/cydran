/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import AbstractBehavior from "behavior/AbstractBehavior";

class ValidatedBehavior extends AbstractBehavior<string, HTMLElement, unknown> {

	constructor() {
		super();
		this.setDefaultExpression("");
		this.setFlag("EXPRESSION_DISALLOWED");
	}

	public onMount(): void {
		// TODO - Implement
	}

}

export default ValidatedBehavior;
