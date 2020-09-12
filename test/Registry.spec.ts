import { RegistryImpl } from "@/Registry";
import { assertNullGuarded } from "@/TestUtils";
import { ModulesContextImpl } from '@/Component';
import { Registry } from '@/Interfaces';

class TestClass {
	// Intentionally empty
}

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
	expect(value).toEqual(specimen.get(key));
});

test("registerPrototype(id, class)", () => {
	const value: TestObj = new TestObj();
	const specimen: Registry = REGISTRY.registerPrototype(value.getName(), TestObj, []);
	expect(specimen).toEqual(REGISTRY);

	const name: string = value.getName();
	const result0: TestObj = specimen.get(name);
	const result1: TestObj = specimen.get(name);

	expect(value).not.toEqual(result0);
	expect(result1.getValue()).toEqual(result0.getValue());
	expect(result1.getName()).not.toEqual(result0.getName());
});

test("registerSingleton(id, class)", () => {
	const other: TestObj = new TestObj();
	const specimen: Registry = REGISTRY.registerSingleton(other.getName(), TestObj, []);
	expect(specimen).toEqual(REGISTRY);

	const name: string = other.getName();
	const result0: TestObj = specimen.get(name);
	const result1: TestObj = specimen.get(name);

	expect(other).not.toEqual(result0);
	expect(result1).toEqual(result0);
	expect(result1.getValue()).toEqual(result0.getValue());
	expect(result1.getName()).toEqual(result0.getName());
});

test("get() - null id", () => {
	assertNullGuarded("id", () => REGISTRY.get(null));
});

test("registerConstant() - invalid id", () => {
	assertNullGuarded("id must be valid", () => REGISTRY.registerConstant("Invalid id!", "Foo"), "ValidationError");
});

test("registerConstant() - null id", () => {
	assertNullGuarded("id", () => REGISTRY.registerConstant(null, "Foo"));
});

test("registerConstant() - null instance", () => {
	assertNullGuarded("instance", () => REGISTRY.registerConstant("foo", null));
});

test("registerSingleton() - invalid id", () => {
	assertNullGuarded("id must be valid", () => REGISTRY.registerSingleton("Invalid id!", TestClass, []), "ValidationError");
});

test("registerSingleton() - null id", () => {
	assertNullGuarded("id", () => REGISTRY.registerSingleton(null, TestClass, []));
});

test("registerSingleton() - null classInstance", () => {
	assertNullGuarded("classInstance", () => REGISTRY.registerSingleton("foo", null, []));
});

test("registerPrototype() - invalid id", () => {
	assertNullGuarded("id must be valid", () => REGISTRY.registerPrototype("Invalid id!", TestClass, []), "ValidationError");
});

test("registerPrototype() - null id", () => {
	assertNullGuarded("id", () => REGISTRY.registerPrototype(null, TestClass, []));
});

test("registerPrototype() - null classInstance", () => {
	assertNullGuarded("classInstance", () => REGISTRY.registerPrototype("foo", null, []));
});

test("addStrategy() - null strategy", () => {
	assertNullGuarded("strategy", () => REGISTRY.addStrategy(null));
});
