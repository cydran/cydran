/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import {
	validateDefined,
	validateValidRegionName,
	validateNotEmptyString,
	validateOneOf,
	validateNotNullIfFieldEquals,
	validateNullUnlessFieldEquals,
	validateDefinedIf,
	validateNotDefinedIf,
	validateValidObjectId,
	validateValidContextName
} from "validator/Validations";
import { beforeEach, describe, afterEach, test, expect } from "@jest/globals";

const wkFn = (spec: {}) => spec["count"] === 0;
let wkObj: { count: number } = null as unknown as { count: number };

describe("Validations", () => {
	beforeEach(() => {
		wkObj = { count: 0 };
	});

	afterEach(() => {
		wkObj = null as unknown as { count: number };
	});

	test("valdiateDefined bad", () => {
		expect(validateDefined(null, {}, {})).toEqual("must be defined");
	});

	test("valdiateDefined good", () => {
		expect(validateDefined("xyz", {}, {})).toBeNull();
	});

	test("validateValidRegionName bad", () => {
		const spec: string = "abc234&#";
		expect(validateValidRegionName(spec, null, null)).toEqual("must be valid region name");
	});

	test("validateValidRegionName good", () => {
		const spec: string = "abCd";
		expect(validateValidRegionName(spec, null, null)).toBeNull();
	});

	test("validateValidObjectId bad", () => {
		const specs: string[] = ["", "/", "foo$", "bar@", "foo\\", "bar/"];
		specs.forEach((test) => {
			expect(validateValidObjectId(test, null, null)).toEqual("must be valid object id");
		});
	});

	test("validateValidObjectId good", () => {
		// \$\@\-\_\.\:\\\/
		const specs: string[] = ["Zasdf234", "a", "m", "A", "foo*bar", "baz:bat", "baz-", "bat_", "qux."];
		specs.forEach((test) => {
			expect(validateValidObjectId(test, null, null)).toBeNull();
		});
	});

	test("validateValidContextName bad", () => {
		const specs: string[] = ["", "/", "foo$", "bar@", "baz-", "bat_", "qux.", "quux:", "foo\\", "bar/"];
		specs.forEach((test) => {
			expect(validateValidContextName(test, null, null)).toEqual("must be valid context name");
		});
	});

	test("validateValidContextName good", () => {
		// \$\@\-\_\.\:\\\/
		const specs: string[] = ["Zasdf234", "a", "m", "A"];
		specs.forEach((test) => {
			expect(validateValidContextName(test, null, null)).toBeNull();
		});
	});

	test("validateNotEmptyString bad", () => {
		const spec: string = "";
		expect(validateNotEmptyString(spec, null, null)).toEqual("must not be empty");
	});

	test("validateNotEmptyString good", () => {
		const spec: string = "whackadoodle";
		expect(validateNotEmptyString(spec, null, null)).toBeNull();
	});

	test("validateNotNullIfFieldEquals - missing while the field equals the value", () => {
		const fieldName: string = "xyz";
		const expectedValue: string = "bubba";
		expect(validateNotNullIfFieldEquals(fieldName, expectedValue)(undefined, { [fieldName]: expectedValue }, null)).toEqual(
			`must be defined as ${fieldName} equals ${expectedValue}`
		);
	});

	test("validateNotNullIfFieldEquals - present while the field equals the value", () => {
		const fieldName: string = "xyz";
		const expectedValue: string = "bubba";
		expect(validateNotNullIfFieldEquals(fieldName, expectedValue)("v().id", { [fieldName]: expectedValue }, null)).toBeNull();
	});

	test("validateNotNullIfFieldEquals - missing while the field has another value", () => {
		const fieldName: string = "xyz";
		const expectedValue: string = "bubba";
		expect(validateNotNullIfFieldEquals(fieldName, expectedValue)(null, { [fieldName]: "Sally" }, null)).toBeNull();
	});

	test("validateNullUnlessFieldEquals - present while the field has another value", () => {
		const fieldName: string = "xyz";
		const expectedValue: string = "bubba";
		expect(validateNullUnlessFieldEquals(fieldName, expectedValue)("v().id", { [fieldName]: "Sally" }, null)).toEqual(
			`must not be defined unless ${fieldName} equals ${expectedValue}`
		);
	});

	test("validateNullUnlessFieldEquals - present while the field equals the value", () => {
		const fieldName: string = "xyz";
		const expectedValue: string = "bubba";
		expect(validateNullUnlessFieldEquals(fieldName, expectedValue)("v().id", { [fieldName]: expectedValue }, null)).toBeNull();
	});

	test("validateNullUnlessFieldEquals - missing while the field has another value", () => {
		const fieldName: string = "xyz";
		const expectedValue: string = "bubba";
		expect(validateNullUnlessFieldEquals(fieldName, expectedValue)(undefined, { [fieldName]: "Sally" }, null)).toBeNull();
	});

	test("validateOneOf bad", () => {
		expect(validateOneOf("foo", "bar")("bat", null, null)).toEqual("must be one of [foo, bar]");
	});

	test("validateOneOf good", () => {
		expect(validateOneOf("foo", "bar")("foo", null, null)).toBeNull();
	});

	const NOTEQZ = "having a count != 0";

	test("validateDefinedIf - unmet condition", () => {
		const result = validateDefinedIf(wkFn, NOTEQZ)(null, null, wkObj);
		expect(result).toEqual(`must be defined as ${NOTEQZ}`);
	});

	test("validateDefinedIf - met condition", () => {
		wkObj.count++;
		const result = validateDefinedIf(wkFn, NOTEQZ)(null, null, wkObj);
		expect(result).toBeNull();
	});

	test("validateNotDefinedIf - unmet condition", () => {
		const wkval: string = "abc";
		expect(validateNotDefinedIf(wkFn, NOTEQZ)(wkval, null, wkObj)).toEqual(`must not be defined as ${NOTEQZ}`);
	});

	test("validateNotDefinedIf - met condition", () => {
		const wkval: string = "abc";
		wkObj.count++;
		const result = validateNotDefinedIf(wkFn, NOTEQZ)(wkval, null, wkObj);
		expect(result).toBeNull();
	});
});
