/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { asBoolean } from "util/AsFunctions";
import ElementReference from "component/ElementReference";
import ElementReferenceImpl from "component/ElementReferenceImpl";
import AbstractValueBehavior from "behavior/AbstractValueBehavior";
import BehaviorFlags from "behavior/BehaviorFlags";

class IfBehavior extends AbstractValueBehavior<boolean, HTMLElement, unknown> {

	private reference: ElementReference<HTMLElement>;

	constructor() {
		super();
		this.setReducerFn(asBoolean);
		this.setFlag(BehaviorFlags.ROOT_PROHIBITED);
	}

	public onMount() {
		this.reference = new ElementReferenceImpl<HTMLElement>(this.getEl(), "Hidden");
		super.onMount();
	}

	protected onChange(previous: boolean, current: boolean): void {
		this.reference.set(current ? this.getEl() : null);
	}

}

export default IfBehavior;
