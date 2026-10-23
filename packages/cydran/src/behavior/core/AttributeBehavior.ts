/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import AbstractBehavior from "behavior/AbstractBehavior";
import { asString } from "util/AsFunctions";
import { requireNotNull } from 'util/Utils';

class AttributeBehavior extends AbstractBehavior<string, HTMLElement, unknown> {

	private attributeName: string;

	constructor(attributeName: string) {
		super();
		this.setReducerFn(asString);
		this.attributeName = requireNotNull(attributeName, "attributeName");
	}

	public onMount(): void {
		this.getEl().setAttribute(this.attributeName, this.getMediator().get());

		if (this.isMutable()) {
			this.getMediator().watch(this, "onChange");
		}
	}

	protected onChange(previous: string, current: string): void {
		this.getEl().setAttribute(this.attributeName, current);
	}

}

export default AttributeBehavior;
