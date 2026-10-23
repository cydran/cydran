/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import AbstractBehavior from 'behavior/AbstractBehavior';

abstract class AbstractValueBehavior<M, E extends HTMLElement | Text, P> extends AbstractBehavior<M, E, P> {

	constructor() {
		super();
	}

	public onMount(): void {
		super.onMount();

		this.onChange(null, this.getMediator().get());

		if (this.isMutable()) {
			this.getMediator().watch(this, "onChange");
		}
	}

	protected abstract onChange(previous: M, current: M): void;

}

export default AbstractValueBehavior;
