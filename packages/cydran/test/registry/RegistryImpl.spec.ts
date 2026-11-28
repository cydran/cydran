/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { assertNullGuarded } from "test/TestUtils";
import RegistryImpl from "registry/RegistryImpl";
import { Context, Registry } from "context/Context";
import GlobalContextImpl from "context/GlobalContextImpl";
import { RegistrationError } from "error/Errors";
import { describe, expect, test } from "@jest/globals";

class TestClass {

	// Intentionally empty

}

const CONTEXT: Context = new GlobalContextImpl().createChild();
const REGISTRY: RegistryImpl = new RegistryImpl(CONTEXT);
const NAME_PREFIX: string = "proto";
const VALUE: string = "Whatever";

class TestObj {

	private static counter: number = 0;

	private name: string;

	private value: string;

	constructor() {
		this.name = NAME_PREFIX + TestObj.counter++;
		this.value = VALUE;
	}

	public getName(): string {
		return this.name;
	}

	public getValue(): string {
		return this.value;
	}

}

describe("Registry", () => {
	test("constructor()", () => {
		expect(new RegistryImpl(CONTEXT)).not.toBeNull();
	});

	test("hasRegistration(id): true", () => {
		const key = "constY";
		const value = "Something";
		const specimen: Registry = REGISTRY.registerConstant(key, value);
		expect(specimen).toEqual(REGISTRY);
		expect(specimen.hasRegistration(key)).toEqual(true);
	});

	test("hasRegistration(id): false", () => {
		const key1 = "whackadoodle-01234567890";
		const key2 = "constZ";
		const value = "Something";
		const specimen: Registry = REGISTRY.registerConstant(key2, value);
		expect(specimen).toEqual(REGISTRY);
		expect(specimen.hasRegistration(key1)).toEqual(false);
		expect(specimen.hasRegistration(key2)).toEqual(true);
	});

	test("RegistryImpl.INSTANCE", () => {
		expect(REGISTRY).not.toBeNull();
	});

	test("registerConstant(id, value)", () => {
		const key = "constX";
		const value = "Whatever";
		const specimen: Registry = REGISTRY.registerConstant(key, value);
		expect(specimen).toEqual(REGISTRY);
		expect(value).toEqual(specimen.getObject(key, [], CONTEXT));
	});

	test("registerPrototype(id, class)", () => {
		const value: TestObj = new TestObj();
		const specimen: Registry = REGISTRY.registerPrototype(value.getName(), TestObj);
		expect(specimen).toEqual(REGISTRY);

		const name: string = value.getName();
		const result0: TestObj = specimen.getObject(name, [], CONTEXT);
		const result1: TestObj = specimen.getObject(name, [], CONTEXT);

		expect(value).not.toEqual(result0);
		expect(result1.getValue()).toEqual(result0.getValue());
		expect(result1.getName()).not.toEqual(result0.getName());
	});

	test("registerSingleton(id, class)", () => {
		const other: TestObj = new TestObj();
		const specimen: Registry = REGISTRY.registerSingleton(other.getName(), TestObj);
		expect(specimen).toEqual(REGISTRY);

		const name: string = other.getName();
		const result0: TestObj = specimen.getObject(name, [], CONTEXT);
		const result1: TestObj = specimen.getObject(name, [], CONTEXT);

		expect(other).not.toEqual(result0);
		expect(result1).toEqual(result0);
		expect(result1.getValue()).toEqual(result0.getValue());
		expect(result1.getName()).toEqual(result0.getName());
	});

	test("getObject() - null id", () => {
		assertNullGuarded("id", () => REGISTRY.getObject(null, [], CONTEXT));
	});

	test("registerConstant() - invalid id", () => {
		assertNullGuarded("id must be valid", () => REGISTRY.registerConstant("Invalid/ id!", "Foo"), "ValidationError");
	});

	test("registerConstant() - null id", () => {
		assertNullGuarded("id", () => REGISTRY.registerConstant(null, "Foo"));
	});

	test("registerConstant() - null instance", () => {
		expect(() => REGISTRY.registerConstant("foo", null)).not.toThrowError("instance must not be null");
	});

	test("registerSingleton() - invalid id", () => {
		assertNullGuarded("id must be valid", () => REGISTRY.registerSingleton("Invalid/ id!", TestClass), "ValidationError");
	});

	test("registerSingleton() - null id", () => {
		assertNullGuarded("id", () => REGISTRY.registerSingleton(null, TestClass));
	});

	test("registerSingleton() - null classInstance", () => {
		assertNullGuarded("classInstance", () => REGISTRY.registerSingleton("foo", null));
	});

	test("registerPrototype() - invalid id", () => {
		assertNullGuarded("id must be valid", () => REGISTRY.registerPrototype("Invalid/ id!", TestClass), "ValidationError");
	});

	test("registerPrototype() - null id", () => {
		assertNullGuarded("id", () => REGISTRY.registerPrototype(null, TestClass));
	});

	test("registerPrototype() - null classInstance", () => {
		assertNullGuarded("classInstance", () => REGISTRY.registerPrototype("foo", null));
	});
});

describe("Registry aliases", () => {
	class Original {

		// Intentionally empty

	}

	class Replacement {

		// Intentionally empty

	}

	test("registerAlias() - resolves the source's object through getLocalObject and getObject", () => {
		const source: RegistryImpl = new RegistryImpl(CONTEXT);
		const target: RegistryImpl = new RegistryImpl(CONTEXT);
		source.registerSingleton("facade", Original);

		target.registerAlias("published", source, "facade");

		const fromSource: unknown = source.getLocalObject("facade", [], CONTEXT);
		expect(target.hasRegistration("published")).toBe(true);
		expect(target.getLocalObject("published", [], CONTEXT)).toBe(fromSource);
		expect(target.getObject("published", [], CONTEXT)).toBe(fromSource);
	});

	test("registerAlias() - follows a re-registration in the source", () => {
		const source: RegistryImpl = new RegistryImpl(CONTEXT);
		const target: RegistryImpl = new RegistryImpl(CONTEXT);
		source.registerPrototype("facade", Original);
		target.registerAlias("facade", source, "facade");

		source.registerPrototype("facade", Replacement);

		expect(target.getObject("facade", [], CONTEXT)).toBeInstanceOf(Replacement);
	});

	test("registerAlias() - throws on an existing registration and leaves it unchanged", () => {
		const source: RegistryImpl = new RegistryImpl(CONTEXT);
		const target: RegistryImpl = new RegistryImpl(CONTEXT);
		source.registerConstant("facade", "from source");
		target.registerConstant("facade", "from target");

		expect(() => target.registerAlias("facade", source, "facade")).toThrow(RegistrationError);
		expect(() => target.registerAlias("facade", source, "facade")).toThrow("already registered with id: facade");
		expect(target.getObject("facade", [], CONTEXT)).toBe("from target");
	});

	test("registerAlias() - throws on an existing alias", () => {
		const source: RegistryImpl = new RegistryImpl(CONTEXT);
		const target: RegistryImpl = new RegistryImpl(CONTEXT);
		source.registerConstant("facade", "value");
		target.registerAlias("facade", source, "facade");

		expect(() => target.registerAlias("facade", source, "facade")).toThrow(RegistrationError);
	});

	test("removeAlias() - removes its own alias", () => {
		const source: RegistryImpl = new RegistryImpl(CONTEXT);
		const target: RegistryImpl = new RegistryImpl(CONTEXT);
		source.registerConstant("facade", "value");
		target.registerAlias("facade", source, "facade");

		target.removeAlias("facade", source);

		expect(target.hasRegistration("facade")).toBe(false);
		expect(target.getObject("facade", [], CONTEXT)).toBeNull();
		expect(source.hasRegistration("facade")).toBe(true);
	});

	test("removeAlias() - keeps a registration made under the id since", () => {
		const source: RegistryImpl = new RegistryImpl(CONTEXT);
		const target: RegistryImpl = new RegistryImpl(CONTEXT);
		source.registerConstant("facade", "from source");
		target.registerAlias("facade", source, "facade");
		target.registerConstant("facade", "from target");

		target.removeAlias("facade", source);

		expect(target.getObject("facade", [], CONTEXT)).toBe("from target");
	});

	test("removeAlias() - keeps an alias for a different source", () => {
		const source: RegistryImpl = new RegistryImpl(CONTEXT);
		const other: RegistryImpl = new RegistryImpl(CONTEXT);
		const target: RegistryImpl = new RegistryImpl(CONTEXT);
		source.registerConstant("facade", "from source");
		target.registerAlias("facade", source, "facade");

		target.removeAlias("facade", other);

		expect(target.getObject("facade", [], CONTEXT)).toBe("from source");
	});

	test("removeAlias() - does nothing for an unknown id", () => {
		const source: RegistryImpl = new RegistryImpl(CONTEXT);
		const target: RegistryImpl = new RegistryImpl(CONTEXT);

		expect(() => target.removeAlias("missing", source)).not.toThrow();
		expect(target.hasRegistration("missing")).toBe(false);
	});

	test("child registry - resolves a parent's alias", () => {
		const source: RegistryImpl = new RegistryImpl(CONTEXT);
		const parent: RegistryImpl = new RegistryImpl(CONTEXT);
		const child: Registry = parent.extend(CONTEXT);
		source.registerConstant("facade", "value");
		parent.registerAlias("facade", source, "facade");

		expect(child.hasRegistration("facade")).toBe(false);
		expect(child.getObject("facade", [], CONTEXT)).toBe("value");
	});

	test("registerAlias() - null targetId", () => {
		assertNullGuarded("targetId", () => REGISTRY.registerAlias(null, REGISTRY, "facade"));
	});

	test("registerAlias() - invalid targetId", () => {
		assertNullGuarded(
			"targetId must be valid",
			() => REGISTRY.registerAlias("Invalid/ id!", REGISTRY, "facade"),
			"ValidationError"
		);
	});

	test("registerAlias() - null source", () => {
		assertNullGuarded("source", () => REGISTRY.registerAlias("facade", null, "facade"));
	});

	test("registerAlias() - null sourceId", () => {
		assertNullGuarded("sourceId", () => REGISTRY.registerAlias("facade", REGISTRY, null));
	});

	test("registerAlias() - invalid sourceId", () => {
		assertNullGuarded(
			"sourceId must be valid",
			() => REGISTRY.registerAlias("facade", REGISTRY, "Invalid/ id!"),
			"ValidationError"
		);
	});

	test("removeAlias() - null targetId", () => {
		assertNullGuarded("targetId", () => REGISTRY.removeAlias(null, REGISTRY));
	});

	test("removeAlias() - invalid targetId", () => {
		assertNullGuarded("targetId must be valid", () => REGISTRY.removeAlias("Invalid/ id!", REGISTRY), "ValidationError");
	});

	test("removeAlias() - null source", () => {
		assertNullGuarded("source", () => REGISTRY.removeAlias("facade", null));
	});
});
