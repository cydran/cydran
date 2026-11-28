/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import AbstractValueBehavior from "behavior/AbstractValueBehavior";

class CSSClassBehavior extends AbstractValueBehavior<unknown, HTMLElement, unknown> {

	protected onChange(previous: unknown, current: unknown): void {
		const oldClasses: string[] = (this.getEl().className || "").trim().split(" ");
		const newClasses: string[] = [];
		const map: unknown = current || {};

		for (const value of oldClasses) {
			if (!Object.keys(map).includes(value)) {
				newClasses.push(value);
			}
		}

		for (const key of Object.keys(map)) {
			if (map[key]) {
				newClasses.push(key);
			}
		}

		this.getEl().className = newClasses.join(" ");
	}

}

export default CSSClassBehavior;
