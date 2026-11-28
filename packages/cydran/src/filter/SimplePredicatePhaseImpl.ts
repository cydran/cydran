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

class SimplePredicatePhaseImpl extends AbstractPhaseImpl {

	private predicate: (index: number, value: ListItem) => boolean;

	constructor(previous: Phase, predicate: (index: number, value: ListItem) => boolean) {
		super(`SimplePredicate`, previous);
		this.predicate = requireNotNull(predicate, "predicate");
	}

	protected execute(items: ListItem[]): ListItem[] {
		const result: ListItem[] = [];

		this.getLogger().ifTrace(() => this.loggerPayload("Before predicate filtration", items));

		// eslint-disable-next-line:prefer-for-of
		for (let i = 0; i < items.length; i++) {
			const current: ListItem = items[i];

			if (this.predicate.apply({}, [i, current])) {
				result.push(current);
			}
		}

		this.getLogger().ifTrace(() => this.loggerPayload("After predicate filtration", result));

		return result;
	}

}

export default SimplePredicatePhaseImpl;
