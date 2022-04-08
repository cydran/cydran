import { mock, spy, verify } from "ts-mockito";
import ScopeImpl from 'scope/ScopeImpl';
import PROPS from "../logger/loggerTestProps.json";
import LoggerFactoryImpl from "log/LoggerFactoryImpl";
import PropertiesImpl from "properties/PropertiesImpl";
import { Properties } from "properties/Property";
import LoggerFactory from "log/LoggerFactory";
import Evaluator from 'eval/Evaluator';

interface Model {

	value: boolean;

}

let factory: LoggerFactory = null;
let properties: Properties = null;

const expression: string = "m().value || v().value || s().scopeValue()" as const;
let scope: ScopeImpl = null;
let modelInstance: Model = null;
let valueInstance: Model = null;
let scopeValue: boolean = false;

beforeAll(() => {
	properties = new PropertiesImpl();
	properties.load(PROPS);
	factory = new LoggerFactoryImpl(properties);
	scope = new ScopeImpl();
	scope.setMFn(() => modelInstance);
	scope.setVFn(() => valueInstance);
	scope.add("scopeValue", () => scopeValue);
});

afterAll(() => {
	properties = null;
	factory = null;
});

let specimen: Evaluator = null;

beforeEach(() => {
	modelInstance = {
		value: false
	};

	valueInstance = {
		value: false
	};

	specimen = new Evaluator(expression, scope, factory.getLogger(`Getter: ${expression}`));
});

afterEach(() => {
	modelInstance = null;
	valueInstance = null;
	specimen = null;
});

test("new Evaluator", () => {
	expect(specimen).not.toBeNull();
});

test("test()", () => {
	expect(specimen.test()).toEqual(false);

	modelInstance.value = false;
	valueInstance.value = false;
	scopeValue = true;
	expect(specimen.test()).toEqual(true);

	modelInstance.value = false;
	valueInstance.value = true;
	scopeValue = false;
	expect(specimen.test()).toEqual(true);

	modelInstance.value = true;
	valueInstance.value = false;
	scopeValue = false;
	expect(specimen.test()).toEqual(true);
});
