/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import OtherVisitor from "component/visitor/OtherVisitor";
import GlobalContextImpl from 'context/GlobalContextImpl';
import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';

let visitor: OtherVisitor = null;

describe("OtherVisitor", () => {

	beforeEach(() => {
		visitor = new OtherVisitor(new GlobalContextImpl());
	});

	afterEach(() => {
		visitor = null;
	});

	test("instance is good", () => {
		expect(visitor).not.toBeNull();
	});

});
