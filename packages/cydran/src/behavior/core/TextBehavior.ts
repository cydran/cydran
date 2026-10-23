/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import AbstractBehavior from "behavior/AbstractBehavior";
import { asString } from "util/AsFunctions";

class TextBehavior extends AbstractBehavior<string, Text, unknown> {

	constructor() {
		super();
		this.setReducerFn(asString);
	}

	public onMount(): void {
		this.getEl().textContent = this.getMediator().get();

		if (this.isMutable()) {
			this.getMediator().watch(this, "onChange");
		}
	}

	protected onChange(previous: string, current: string): void {
		this.getEl().textContent = current;
	}

}

export default TextBehavior;