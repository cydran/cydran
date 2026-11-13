/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Context } from "context/Context";
import ContextArgumentResolver from "argument/resolver/ContextArgumentResolver";
import GlobalContextImpl from "context/GlobalContextImpl";
import { beforeAll, describe, expect, test } from '@jest/globals';

let wkContext: Context;

describe("ContextArgumentResolver", () => {

	beforeAll(() => {
		wkContext = new GlobalContextImpl().createChild();
	});

	test("specimen is whole", () => {
		const specimen: ContextArgumentResolver = new ContextArgumentResolver();
		expect(specimen).not.toBeNull();
	});

	test("resolve", () => {
		const specimen: ContextArgumentResolver = new ContextArgumentResolver();
		expect(specimen.resolve(wkContext)).toEqual(wkContext);
	});

});
