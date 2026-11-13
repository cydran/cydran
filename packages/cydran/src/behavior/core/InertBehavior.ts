/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { asBoolean } from "util/AsFunctions";
import AbstractValueBehavior from "behavior/AbstractValueBehavior";

class InertBehavior extends AbstractValueBehavior<boolean, HTMLInputElement, unknown> {

	constructor() {
		super();
		this.setReducerFn(asBoolean);
	}

	protected onChange(previous: boolean, current: boolean): void {
		// Keyed access to field due to newness of inert in HTMLElement spec such that it hasn't made into TypeScript yet
		this.getEl()["inert"] = current;
	}

}

export default InertBehavior;
