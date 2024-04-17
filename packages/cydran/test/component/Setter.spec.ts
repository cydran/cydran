import { test, expect, beforeAll, afterAll, beforeEach, afterEach } from "@jest/globals";
import Setter from 'mediator/Setter';
import ScopeImpl from 'scope/ScopeImpl';
import PROPS from "../logger/loggerTestProps.json";
import PropertiesAlternativeImpl from "properties/PropertiesAlternativeImpl";
import { Properties } from "properties/Property";
import LoggerFactory from "log/LoggerFactory";

interface Model {

	value: string;

}

let wkProps: Properties = null;

let scope: ScopeImpl = null;
let modelInstance: Model = null as unknown as Model;
let valueInstance: Model = null as unknown as Model;

beforeAll(() => {
	wkProps = new PropertiesAlternativeImpl();
	wkProps.load(PROPS);
	LoggerFactory.init(wkProps);
	scope = new ScopeImpl();
	scope.setMFn(() => modelInstance);
	scope.setVFn(() => valueInstance);
});

afterAll(() => {
	wkProps = null;
});

beforeEach(() => {
	modelInstance = {
		value: "foo"
	};

	valueInstance = {
		value: "bat"
	};
});

afterEach(() => {
	modelInstance = null as unknown as Model;
	valueInstance = null as unknown as Model;
});

test("new Setter", () => {
	expect(new Setter("m().value", LoggerFactory.getLogger(`Setter`))).not.toBeNull();
});

test("set(scope, value) - m()", () => {
	const specimen: Setter = new Setter("m().value", LoggerFactory.getLogger(`Setter`));
	expect(modelInstance).not.toBeNull();
	expect(modelInstance.value).toEqual("foo");
	expect(valueInstance.value).toEqual("bat");

	specimen.set(scope, "bar");

	expect(modelInstance).not.toBeNull();
	expect(modelInstance.value).toEqual("bar");
	expect(valueInstance.value).toEqual("bat");
});

test("set(scope, value) - v()", () => {
	const specimen: Setter = new Setter("v().value", LoggerFactory.getLogger(`Setter`));
	expect(modelInstance).not.toBeNull();
	expect(modelInstance.value).toEqual("foo");
	expect(valueInstance.value).toEqual("bat");

	specimen.set(scope, "baz");

	expect(modelInstance).not.toBeNull();
	expect(modelInstance.value).toEqual("foo");
	expect(valueInstance.value).toEqual("baz");
});

test("set(scope, value) - s()", () => {
	const specimen: Setter = new Setter("s().value", LoggerFactory.getLogger(`Setter`));
	expect(modelInstance).not.toBeNull();
	expect(modelInstance.value).toEqual("foo");
	expect(valueInstance.value).toEqual("bat");
	expect(scope.getItems()["value"]).toBeUndefined();

	specimen.set(scope, "baz");

	expect(modelInstance).not.toBeNull();
	expect(modelInstance.value).toEqual("foo");
	expect(valueInstance.value).toEqual("bat");
	expect(scope.getItems()["value"]).toBeUndefined();
});

test("set(scope, value) - u()", () => {
	const specimen: Setter = new Setter("u().value", LoggerFactory.getLogger(`Setter`));
	expect(modelInstance).not.toBeNull();
	expect(modelInstance.value).toEqual("foo");
	expect(valueInstance.value).toEqual("bat");
	expect(scope.getItems()["value"]).toBeUndefined();

	specimen.set(scope, "baz");

	expect(modelInstance).not.toBeNull();
	expect(modelInstance.value).toEqual("foo");
	expect(valueInstance.value).toEqual("bat");
	expect(scope.getItems()["value"]).toBeUndefined();
});
