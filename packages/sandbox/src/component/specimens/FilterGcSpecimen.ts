/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component, Filter } from "@cydran/cydran";
import TEMPLATE from "./FilterGcSpecimen.html";

interface Item {
	id: number;
	name: string;
}

/**
 * Specimen: a reactive `createFilter` over a list. `Filter.items()` returns a cache that is only
 * refreshed by the filter's internal watcher callback (registered via `addCallback(this, () => ...)`,
 * an inline closure held only weakly). This specimen exists to prove — under forced GC — that the
 * filter keeps recomputing when its source list changes.
 */
class FilterGcSpecimen extends Component {

	private items: Item[];

	private filtered: Filter;

	constructor() {
		super(TEMPLATE);
		this.items = [{ id: 1, name: "alpha" }, { id: 2, name: "bravo" }];
		this.filtered = this.$c().createFilter("m().items").build();
	}

	public addItem(): void {
		const next: number = this.items.length + 1;
		this.items = [...this.items, { id: next, name: "item-" + next }];
	}

}

export default FilterGcSpecimen;
