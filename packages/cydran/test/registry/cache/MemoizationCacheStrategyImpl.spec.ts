/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { describe, expect, test } from '@jest/globals';
import CacheStrategy from "registry/cache/CacheStrategy";
import MemoizationCacheStrategyImpl from "registry/cache/MemoizationCacheStrategyImpl";

describe("MemoizationCacheStrategyImpl", () => {

	test("Null value", () => {
		const specimen: CacheStrategy<string> = new MemoizationCacheStrategyImpl<string>();
		const result: string = specimen.resolve(() => null);

		expect(result).toBeNull();
	});

	test("Non-null value", () => {
		const specimen: CacheStrategy<string> = new MemoizationCacheStrategyImpl<string>();
		const results: string[] = [];
		results.push(specimen.resolve(() => "Alpha"));
		results.push(specimen.resolve(() => "Beta"));
		results.push(specimen.resolve(() => "Gamma"));

		expect(results).toEqual(["Alpha", "Alpha", "Alpha"]);
	});

});
