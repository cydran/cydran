/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import BehaviorStates from "behavior/BehaviorStates";
import { isDefined } from "util/Utils";

const enumKeys: string[] = "UNINITIALIZED,INITIALIZED,READY,MOUNTED,UNMOUNTED".split(",");

test("all accounted for", () => {
	for(const key of enumKeys) {
		const behavTrans: BehaviorStates = BehaviorStates[key.toUpperCase()];
		expect(behavTrans).toEqual(key);
	}
});

test("associated values are correct", () => {
	for(const key of enumKeys) {
		switch(key) {
			case BehaviorStates.UNINITIALIZED:
			case BehaviorStates.INITIALIZED:
			case BehaviorStates.READY:
			case BehaviorStates.MOUNTED:
			case BehaviorStates.UNMOUNTED:
				expect(isDefined(BehaviorStates[key.toUpperCase()])).toBe(true);
				break;
			default:
				fail("invalid value");
		}
	}
});
