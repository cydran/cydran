/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { isDefined } from "util/Utils";
import AbstractValueBehavior from "behavior/AbstractValueBehavior";

class StyleBehavior extends AbstractValueBehavior<unknown, HTMLElement, unknown> {

	protected onChange(previous: unknown, current: unknown): void {
		if (!isDefined(current)) {
			return;
		}

		for (const key of Object.keys(current)) {
			this.getEl().style[key] = current[key] + "";
		}
	}

}

export default StyleBehavior;
