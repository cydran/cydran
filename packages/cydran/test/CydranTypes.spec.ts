/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { describe, expect, test } from "@jest/globals";
import {
	ConstructorArgument,
	InstanceArgument,
	ListItem,
	LogArgument,
	MessagePayload,
	ModelValue,
	PropertyValue,
	ScopeItem
} from "CydranTypes";

// The standard types only exist at compile time. Each test compiles only if the type behaves like `unknown`; ts-jest
// type-checks this file, so a standard type that rejected a value, or allowed an unnarrowed read, would fail the suite.

const SAMPLES: unknown[] = ["text", 42, null, undefined, { key: "value" }];

describe("Standard types accept any value", () => {
	test("MessagePayload", () => {
		const values: MessagePayload[] = ["text", 42, null, undefined, { key: "value" }];
		expect(values).toEqual(SAMPLES);
	});

	test("InstanceArgument", () => {
		const values: InstanceArgument[] = ["text", 42, null, undefined, { key: "value" }];
		expect(values).toEqual(SAMPLES);
	});

	test("ConstructorArgument", () => {
		const values: ConstructorArgument[] = ["text", 42, null, undefined, { key: "value" }];
		expect(values).toEqual(SAMPLES);
	});

	test("LogArgument", () => {
		const values: LogArgument[] = ["text", 42, null, undefined, { key: "value" }];
		expect(values).toEqual(SAMPLES);
	});

	test("PropertyValue", () => {
		const values: PropertyValue[] = ["text", 42, null, undefined, { key: "value" }];
		expect(values).toEqual(SAMPLES);
	});

	test("ModelValue", () => {
		const values: ModelValue[] = ["text", 42, null, undefined, { key: "value" }];
		expect(values).toEqual(SAMPLES);
	});

	test("ScopeItem", () => {
		const values: ScopeItem[] = ["text", 42, null, undefined, { key: "value" }];
		expect(values).toEqual(SAMPLES);
	});

	test("ListItem", () => {
		const values: ListItem[] = ["text", 42, null, undefined, { key: "value" }];
		expect(values).toEqual(SAMPLES);
	});
});

describe("Standard types are interchangeable with unknown", () => {
	test("a standard type and unknown are assignable both ways", () => {
		const original: unknown = { key: "value" };
		const named: MessagePayload = original;
		const back: unknown = named;

		expect(back).toBe(original);
	});
});

describe("Standard types still need narrowing", () => {
	test("a property read without narrowing does not compile", () => {
		const payload: MessagePayload = { key: "value" };

		// @ts-expect-error A standard type is unknown, so it must be narrowed before its properties are read
		const unchecked: unknown = payload.key;

		expect(unchecked).toBe("value");
	});

	test("a narrowed value can be read", () => {
		const payload: MessagePayload = { key: "value" };
		let result: string = null as unknown as string;

		if (typeof payload === "object" && payload !== null && "key" in payload) {
			result = String(payload.key);
		}

		expect(result).toBe("value");
	});
});
