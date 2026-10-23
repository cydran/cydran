/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import PropertyProviderArgumentResolver from "argument/resolver/PropertyProviderArgumentResolver";
import GlobalContextImpl from "context/GlobalContextImpl";
import { beforeAll, describe, expect, test } from '@jest/globals';
import { Context } from 'context/Context';
import { PropertyKeys } from 'CydranConstants';

let wkContext: Context;

describe("PropertyProviderArgumentResolver", () => {

	beforeAll(() => {
		wkContext = new GlobalContextImpl().createChild();
	});

	test("specimen is whole", () => {
		const specimen: PropertyProviderArgumentResolver = new PropertyProviderArgumentResolver(PropertyKeys.CYDRAN_LOG_LEVEL);
		expect(specimen).not.toBeNull();
	});

	test("resolve", () => {
		const specimen: PropertyProviderArgumentResolver = new PropertyProviderArgumentResolver(PropertyKeys.CYDRAN_LOG_LEVEL);
		expect(specimen.resolve(wkContext)()).toEqual("debug");
	});

});
