import { assertNullGuarded } from "test/TestUtils";
import RegistryImpl from 'registry/RegistryImpl';
import Registry from 'registry/Registry';
import Context from 'context/Context';
import GlobalContextImpl from 'context/GlobalContextImpl';
import { describe, expect, test } from '@jest/globals';

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
		expect(new RegistryImpl()).not.toBeNull();
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
		expect(value).toEqual(specimen.getObject(key));
	});

	test("registerPrototype(id, class)", () => {
		const value: TestObj = new TestObj();
		const specimen: Registry = REGISTRY.registerPrototype(value.getName(), TestObj);
		expect(specimen).toEqual(REGISTRY);

		const name: string = value.getName();
		const result0: TestObj = specimen.getObject(name);
		const result1: TestObj = specimen.getObject(name);

		expect(value).not.toEqual(result0);
		expect(result1.getValue()).toEqual(result0.getValue());
		expect(result1.getName()).not.toEqual(result0.getName());
	});

	test("registerSingleton(id, class)", () => {
		const other: TestObj = new TestObj();
		const specimen: Registry = REGISTRY.registerSingleton(other.getName(), TestObj);
		expect(specimen).toEqual(REGISTRY);

		const name: string = other.getName();
		const result0: TestObj = specimen.getObject(name);
		const result1: TestObj = specimen.getObject(name);

		expect(other).not.toEqual(result0);
		expect(result1).toEqual(result0);
		expect(result1.getValue()).toEqual(result0.getValue());
		expect(result1.getName()).toEqual(result0.getName());
	});

	test("getObject() - null id", () => {
		assertNullGuarded("id", () => REGISTRY.getObject(null));
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
