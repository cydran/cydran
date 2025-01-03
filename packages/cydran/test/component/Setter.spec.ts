import { test, expect, beforeAll, afterAll, beforeEach, afterEach, describe } from "@jest/globals";
import Setter from 'mediator/Setter';
import ScopeImpl from 'scope/ScopeImpl';
import PROPS from "../logger/loggerTestProps.json";
import PropertiesImpl from "properties/PropertiesImpl";
import { Properties } from "properties/Property";
import getLogger from 'log/getLogger';
import GlobalContextImpl from 'context/GlobalContextImpl';
import { requireNotNull } from 'util/Utils';

requireNotNull(GlobalContextImpl, "GlobalContextImpl");

interface Model {

	value: string;

}

let wkProps: Properties = null;

let scope: ScopeImpl = null;
let modelInstance: Model = null as unknown as Model;
let valueInstance: Model = null as unknown as Model;

describe("Setter", () => {

	beforeAll(() => {
		wkProps = new PropertiesImpl();
		wkProps.load(PROPS);
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
		expect(new Setter("m().value", getLogger(`setter`))).not.toBeNull();
	});

	test("set(scope, value) - m()", () => {
		const specimen: Setter = new Setter("m().value", getLogger(`setter`));
		expect(modelInstance).not.toBeNull();
		expect(modelInstance.value).toEqual("foo");
		expect(valueInstance.value).toEqual("bat");

		specimen.set(scope, "bar");

		expect(modelInstance).not.toBeNull();
		expect(modelInstance.value).toEqual("bar");
		expect(valueInstance.value).toEqual("bat");
	});

	test("set(scope, value) - v()", () => {
		const specimen: Setter = new Setter("v().value", getLogger(`setter`));
		expect(modelInstance).not.toBeNull();
		expect(modelInstance.value).toEqual("foo");
		expect(valueInstance.value).toEqual("bat");

		specimen.set(scope, "baz");

		expect(modelInstance).not.toBeNull();
		expect(modelInstance.value).toEqual("foo");
		expect(valueInstance.value).toEqual("baz");
	});

	test("set(scope, value) - s()", () => {
		const specimen: Setter = new Setter("s().value", getLogger(`setter`));
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
		const specimen: Setter = new Setter("u().value", getLogger(`setter`));
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

});
