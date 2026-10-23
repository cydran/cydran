/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import BehaviorFlags from "behavior/BehaviorFlags";
import { isDefined } from "util/Utils";

const enumKeys: string[] = "ROOT_PROHIBITED,CHILD_CONSUMPTION_PROHIBITED".split(",");

test("all accounted for", () => {
	for(const key of enumKeys) {
		const behavTrans: BehaviorFlags = BehaviorFlags[key.toUpperCase()];
		expect(behavTrans).toEqual(key);
	}
});

test("associated values are correct", () => {
	for(const key of enumKeys) {
		switch(key) {
			case BehaviorFlags.ROOT_PROHIBITED:
			case BehaviorFlags.CHILD_CONSUMPTION_PROHIBITED:
				expect(isDefined(BehaviorFlags[key.toUpperCase()])).toBe(true);
				break;
			default:
				fail("invalid value");
		}
	}
});
