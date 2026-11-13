/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { test, expect, beforeAll, afterAll, beforeEach, afterEach, describe } from "@jest/globals";
import ScopeImpl from 'scope/ScopeImpl';
import PROPS from "../logger/loggerTestProps.json";
import PropertiesImpl from "properties/PropertiesImpl";
import { MutableProperties } from "properties/Property";
import ComparisonEvaluator from 'eval/ComparisonEvaluator';
import getLogger from 'log/getLogger';
import GlobalContextImpl from 'context/GlobalContextImpl';
import { requireNotNull } from 'util/Utils';

requireNotNull(GlobalContextImpl, "GlobalContextImpl");

interface Model {

	value: string;

}

let properties: MutableProperties = null;

const expression: string = "a + b + p(0) + s().scopeItem" as const;
let scope: ScopeImpl = null;

describe("ComparisonEvaluator", () => {

	beforeAll(() => {
		properties = new PropertiesImpl();
		properties.load(PROPS);
		scope = new ScopeImpl();
		scope.add("scopeItem", 8);
	});

	afterAll(() => {
		properties = null;
	});

	let specimen: ComparisonEvaluator = null;

	beforeEach(() => {
		specimen = new ComparisonEvaluator(expression, scope, getLogger('getter', `Getter: ${expression}`));
	});

	afterEach(() => {
		specimen = null;
	});

	test("new ComparisonEvaluator", () => {
		expect(specimen).not.toBeNull();
	});

	test("test", () => {
		expect(specimen.compare(1, 2, [() => 4])).toEqual(15);
	});

});
