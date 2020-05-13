import { Registry, RegistryImpl } from "@/registry/Registry";
import { assertNullGuarded } from "@/util/TestUtils";
import { assert } from "chai";
import { describe, it } from "mocha";
import ModulesContextImpl from "@/module/ModulesContextImpl";

class TestClass {
	// Intentionally empty
}

describe("Registry tests", () => {

	const REGISTRY: RegistryImpl = new RegistryImpl(new ModulesContextImpl().getDefaultModule());
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

	it("RegistryImpl.INSTANCE", () => {
		assert.isNotNull(REGISTRY, "is null");
	});

	it("registerConstant(id, value)", () => {
		const key = "constX";
		const value = "Whatever";
		const specimen: Registry = REGISTRY.registerConstant(key, value);
		assert.equal(specimen, REGISTRY, "not same Registry");
		assert.equal(value, specimen.get(key), "not same value for key of '" + key + "'");
	});

	it("registerPrototype(id, class)", () => {
		const value: TestObj = new TestObj();
		const specimen: Registry = REGISTRY.registerPrototype(value.getName(), TestObj, []);
		assert.equal(specimen, REGISTRY, "not same Registry");

		const name: string  = value.getName();
		const result0: TestObj = specimen.get(name);
		const result1: TestObj = specimen.get(name);

		assert.notEqual(value, result0, "not the same object reference");
		assert.equal(result1.getValue(), result0.getValue(), "not same value for 'value' key");
		assert.notEqual(result1.getName(), result0.getName(), "same value for 'name' key of '" + name + "'");
	});

	it("registerSingleton(id, class)", () => {
		const other: TestObj = new TestObj();
		const specimen: Registry = REGISTRY.registerSingleton(other.getName(), TestObj, []);
		assert.equal(specimen, REGISTRY, "not same Registry");

		const name: string = other.getName();
		const result0: TestObj = specimen.get(name);
		const result1: TestObj = specimen.get(name);

		assert.notEqual(other, result0, "same object reference");
		assert.equal(result1, result0, "not same object reference");
		assert.equal(result1.getValue(), result0.getValue(), "not same value for 'value' key");
		assert.equal(result1.getName(), result0.getName(), "not same value for 'name' key of '" + name + "'");
	});

	it("get() - null id", () => {
		assertNullGuarded("id", () => REGISTRY.get(null));
	});

	it("get() - invalid id", () => {
		assertNullGuarded("id must be valid", () => REGISTRY.get("Invalid id!"), "ValidationError");
	});

	it("registerConstant() - invalid id", () => {
		assertNullGuarded("id must be valid", () => REGISTRY.registerConstant("Invalid id!", "Foo"), "ValidationError");
	});

	it("registerConstant() - null id", () => {
		assertNullGuarded("id", () => REGISTRY.registerConstant(null, "Foo"));
	});

	it("registerConstant() - null instance", () => {
		assertNullGuarded("instance", () => REGISTRY.registerConstant("foo", null));
	});

	it("registerSingleton() - invalid id", () => {
		assertNullGuarded("id must be valid", () => REGISTRY.registerSingleton("Invalid id!", TestClass, []), "ValidationError");
	});

	it("registerSingleton() - null id", () => {
		assertNullGuarded("id", () => REGISTRY.registerSingleton(null, TestClass, []));
	});

	it("registerSingleton() - null classInstance", () => {
		assertNullGuarded("classInstance", () => REGISTRY.registerSingleton("foo", null, []));
	});

	it("registerPrototype() - invalid id", () => {
		assertNullGuarded("id must be valid", () => REGISTRY.registerPrototype("Invalid id!", TestClass, []), "ValidationError");
	});

	it("registerPrototype() - null id", () => {
		assertNullGuarded("id", () => REGISTRY.registerPrototype(null, TestClass, []));
	});

	it("registerPrototype() - null classInstance", () => {
		assertNullGuarded("classInstance", () => REGISTRY.registerPrototype("foo", null, []));
	});

	it("addStrategy() - null strategy", () => {
		assertNullGuarded("strategy", () => REGISTRY.addStrategy(null));
	});

});
