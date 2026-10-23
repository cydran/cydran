/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Context } from "context/Context";
import InstanceIdFnArgumentResolver from "argument/resolver/InstanceIdFnArgumentResolver";
import GlobalContextImpl from 'context/GlobalContextImpl';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

const context: Context = new GlobalContextImpl().createChild();

let specimen: InstanceIdFnArgumentResolver;

describe("InstanceIdFnArgumentResolver", () => {

	beforeEach(() => {
		specimen = new InstanceIdFnArgumentResolver();
	});

	afterEach(() => {
		specimen = null;
	});

	test("specimen is whole", () => {
		expect(specimen).not.toBeNull();
	});

	test("resolve item", () => {
		const idFn: Function = specimen.resolve(context);
		expect(idFn).not.toBeNull();
		expect(/^\d+\-\d+\-\d+$/.test(idFn())).toBe(true);
	});

});