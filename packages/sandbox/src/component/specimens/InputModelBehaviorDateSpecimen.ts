/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./InputModelBehaviorDateSpecimen.html";

/**
 * Specimen: two-way `c-model` on `<input type="date">`.
 *
 * The DATE accessor strategy binds via `el.valueAsDate` (UTC), so `value` is a real
 * `Date` object (or `null` when the field is cleared). `formatted()` renders the ISO
 * date and `typeName()` proves the model holds a `Date`, not a string.
 */
class InputModelBehaviorDateSpecimen extends Component {

	private value: Date | null;

	constructor() {
		super(TEMPLATE);
		this.value = new Date("2024-01-15T00:00:00.000Z");
	}

	public formatted(): string {
		return this.value === null ? "null" : this.value.toISOString().substring(0, 10);
	}

	public typeName(): string {
		if (this.value === null) {
			return "null";
		}

		return this.value instanceof Date ? "Date" : typeof this.value;
	}

	public stamp(): void {
		this.value = new Date("2024-12-25T00:00:00.000Z");
	}

	public clear(): void {
		this.value = null;
	}

}

export default InputModelBehaviorDateSpecimen;
