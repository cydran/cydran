/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { isMutableBehaviorExpression, trimBehaviorExpression } from "component/visitor/BehaviorExpressions";
import { describe, expect, test } from "@jest/globals";

describe("BehaviorExpressions", () => {
	describe("trimBehaviorExpression()", () => {
		test("plain expression is unchanged", () => {
			expect(trimBehaviorExpression("m().x")).toEqual("m().x");
		});

		test("[[ ]] is removed", () => {
			expect(trimBehaviorExpression("[[m().x]]")).toEqual("m().x");
		});

		test("{{ }} is removed", () => {
			expect(trimBehaviorExpression("{{m().x}}")).toEqual("m().x");
		});

		test("empty delimiters are left alone", () => {
			expect(trimBehaviorExpression("[[]]")).toEqual("[[]]");
		});
	});

	describe("isMutableBehaviorExpression()", () => {
		test("plain expression is mutable", () => {
			expect(isMutableBehaviorExpression("m().x")).toBe(true);
		});

		test("[[ ]] is not mutable", () => {
			expect(isMutableBehaviorExpression("[[m().x]]")).toBe(false);
		});

		test("{{ }} is mutable", () => {
			expect(isMutableBehaviorExpression("{{m().x}}")).toBe(true);
		});
	});
});
