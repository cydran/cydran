/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import ItemComponentFactoryImpl from "behavior/core/each/ItemComponentFactoryImpl";
import { Context } from 'context/Context';
import GlobalContextImpl from 'context/GlobalContextImpl';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

const template: string = "<div></div>";
const prefix: string = "x";

function context(): Context {
	return new GlobalContextImpl().createChild();
}

describe("ItemComponentFactoryImpl", () => {

	let instance: ItemComponentFactoryImpl = null;

	beforeEach(() => {
		const wkMod: Context = context();
		instance = new ItemComponentFactoryImpl(wkMod, template, prefix, null, null, null);
	});

	afterEach(() => {
		instance = null;
	});

	test("Instance is good and ready", () => {
		expect(instance).not.toBeNull();
	});

});
