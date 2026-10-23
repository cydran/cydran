/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import BehaviorTransitions from "behavior/BehaviorTransitions";
import { isDefined } from "util/Utils";

const enumKeys: string[] = "init,mount,unmount".split(",");

test("all accounted for", () => {
	for(const key of enumKeys) {
		const behavTrans: BehaviorTransitions = BehaviorTransitions[key.toUpperCase()];
		expect(behavTrans).toEqual(key);
	}
});

test("associated values are correct", () => {
	for(const key of enumKeys) {
		switch(key) {
			case BehaviorTransitions.INIT:
			case BehaviorTransitions.MOUNT:
			case BehaviorTransitions.UNMOUNT:
				expect(isDefined(BehaviorTransitions[key.toUpperCase()])).toBe(true);
				break;
			default:
				fail("invalid value");
		}
	}
});
