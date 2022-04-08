import { mock, verify } from "ts-mockito";
import Setter from 'mediator/Setter';
import ScopeImpl from 'scope/ScopeImpl';
import PROPS from "../logger/loggerTestProps.json";
import LoggerFactoryImpl from "log/LoggerFactoryImpl";
import PropertiesImpl from "properties/PropertiesImpl";
import { Properties } from "properties/Property";
import LoggerFactory from "log/LoggerFactory";

interface Model {

	value: string;

}

let lf: LoggerFactory = null;
let wkProps: Properties = null;

let scope: ScopeImpl = null;
let modelInstance: Model = null;
let valueInstance: Model = null;

beforeAll(() => {
	wkProps = new PropertiesImpl();
	wkProps.load(PROPS);
	lf = new LoggerFactoryImpl(wkProps);
	scope = new ScopeImpl();
	scope.setMFn(() => modelInstance);
	scope.setVFn(() => valueInstance);
});

afterAll(() => {
	wkProps = null;
	lf = null;
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
	modelInstance = null;
	valueInstance = null;
});

test("new Setter", () => {
	expect(new Setter("m().value", lf.getLogger(`Setter`))).not.toBeNull();
});

test("set(scope, value) - m()", () => {
	const specimen: Setter = new Setter("m().value", lf.getLogger(`Setter`));
	expect(modelInstance).not.toBeNull();
	expect(modelInstance.value).toEqual("foo");
	expect(valueInstance.value).toEqual("bat");

	specimen.set(scope, "bar");

	expect(modelInstance).not.toBeNull();
	expect(modelInstance.value).toEqual("bar");
	expect(valueInstance.value).toEqual("bat");
});

test("set(scope, value) - v()", () => {
	const specimen: Setter = new Setter("v().value", lf.getLogger(`Setter`));
	expect(modelInstance).not.toBeNull();
	expect(modelInstance.value).toEqual("foo");
	expect(valueInstance.value).toEqual("bat");

	specimen.set(scope, "baz");

	expect(modelInstance).not.toBeNull();
	expect(modelInstance.value).toEqual("foo");
	expect(valueInstance.value).toEqual("baz");
});

test("set(scope, value) - s()", () => {
	const specimen: Setter = new Setter("s().value", lf.getLogger(`Setter`));
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
	const specimen: Setter = new Setter("u().value", lf.getLogger(`Setter`));
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
