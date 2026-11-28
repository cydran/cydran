/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { assertNullGuarded } from "test/TestUtils";
import AliasFactoryImpl from "registry/factory/AliasFactoryImpl";
import RegistryImpl from "registry/RegistryImpl";
import { Context, Registry } from "context/Context";
import GlobalContextImpl from "context/GlobalContextImpl";
import { describe, expect, jest, test } from "@jest/globals";

const CONTEXT: Context = new GlobalContextImpl().createChild();

class First {

	// Intentionally empty

}

class Second {

	// Intentionally empty

}

describe("AliasFactoryImpl", () => {
	test("get() - delegates to the source's own registration with the local context", () => {
		const expected: object = {};
		const getLocalObject = jest.fn(() => expected);
		const source: Registry = { getLocalObject: getLocalObject } as unknown as Registry;
		const localContext: Context = {} as Context;
		const originContext: Context = {} as Context;
		const args: unknown[] = ["a", 1];
		const specimen: AliasFactoryImpl<object> = new AliasFactoryImpl(source, "sourceId");

		const result: object = specimen.get(localContext, originContext, args);

		expect(result).toBe(expected);
		expect(getLocalObject).toHaveBeenCalledTimes(1);
		expect(getLocalObject).toHaveBeenCalledWith("sourceId", args, localContext);
	});

	test("get() - resolves the source registration current at resolution time", () => {
		const source: RegistryImpl = new RegistryImpl(CONTEXT);
		source.registerPrototype("thing", First);
		const specimen: AliasFactoryImpl<unknown> = new AliasFactoryImpl(source, "thing");

		expect(specimen.get(CONTEXT, CONTEXT, [])).toBeInstanceOf(First);

		source.registerPrototype("thing", Second);

		expect(specimen.get(CONTEXT, CONTEXT, [])).toBeInstanceOf(Second);
	});

	test("get() - returns null when the source has no registration under the id", () => {
		const source: RegistryImpl = new RegistryImpl(CONTEXT);
		const specimen: AliasFactoryImpl<unknown> = new AliasFactoryImpl(source, "missing");

		expect(specimen.get(CONTEXT, CONTEXT, [])).toBeNull();
	});

	test("$release() - leaves the source registration in place", () => {
		const source: RegistryImpl = new RegistryImpl(CONTEXT);
		source.registerConstant("thing", "value");
		const specimen: AliasFactoryImpl<unknown> = new AliasFactoryImpl(source, "thing");

		specimen.$release();

		expect(source.hasRegistration("thing")).toBe(true);
		expect(source.getLocalObject("thing", [], CONTEXT)).toBe("value");
	});

	test("getSource() and getSourceId()", () => {
		const source: RegistryImpl = new RegistryImpl(CONTEXT);
		const specimen: AliasFactoryImpl<unknown> = new AliasFactoryImpl(source, "thing");

		expect(specimen.getSource()).toBe(source);
		expect(specimen.getSourceId()).toBe("thing");
	});

	test("constructor() - null source", () => {
		assertNullGuarded("source", () => new AliasFactoryImpl(null, "thing"));
	});

	test("constructor() - null sourceId", () => {
		assertNullGuarded("sourceId", () => new AliasFactoryImpl(new RegistryImpl(CONTEXT), null));
	});

	test("constructor() - invalid sourceId", () => {
		assertNullGuarded(
			"sourceId must be valid",
			() => new AliasFactoryImpl(new RegistryImpl(CONTEXT), "Invalid/ id!"),
			"ValidationError"
		);
	});
});
