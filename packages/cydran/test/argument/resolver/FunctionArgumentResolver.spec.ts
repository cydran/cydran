/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Context } from "context/Context";
import FunctionArgumentResolver from "argument/resolver/FunctionArgumentResolver";
import GlobalContextImpl from 'context/GlobalContextImpl';
import { beforeAll, describe, expect, test } from '@jest/globals';

const whatEvFn = (): string => { return "whatever"; };
let wkContext: Context;

describe("FunctionArgumentResolver", () => {

	beforeAll(() => {
		wkContext = new GlobalContextImpl().createChild();
	});

	test("specimen is whole", () => {
		const specimen: FunctionArgumentResolver = new FunctionArgumentResolver(whatEvFn);
		expect(specimen).not.toBeNull();
	});

	test("resolve item", () => {
		const specimen: FunctionArgumentResolver = new FunctionArgumentResolver(() => 2 * 2);
		expect(specimen.resolve(wkContext)).toEqual(4);
	});

});
