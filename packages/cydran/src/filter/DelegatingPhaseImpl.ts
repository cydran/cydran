/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Phase from "filter/Phase";
import AbstractPhaseImpl from "filter/AbstractPhaseImpl";
import { requireNotNull } from "util/Utils";
import { ListItem } from "CydranTypes";

class DelegatingPhaseImpl extends AbstractPhaseImpl {

	private fn: (input: ListItem[]) => ListItem[];

	constructor(previous: Phase, fn: (input: ListItem[]) => ListItem[]) {
		super("Delegating", previous);
		this.fn = requireNotNull(fn, "fn");
	}

	protected execute(items: ListItem[]): ListItem[] {
		return this.fn.apply({}, [items]);
	}

}

export default DelegatingPhaseImpl;
