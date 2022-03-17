import { mock, spy, verify } from "ts-mockito";
import Setter from 'mediator/Setter';
import ScopeImpl from 'scope/ScopeImpl';

import PROPS from "../logger/loggerTestProps.json";
import LoggerFactoryImpl from "log/LoggerFactoryImpl";
import PropertiesImpl from "properties/PropertiesImpl";
import { Properties } from "properties/Property";
import LoggerFactory from "log/LoggerFactory";

let lf: LoggerFactory = null;
let wkProps: Properties = null;

const wkExpr: string = "x = 1" as const;

beforeAll(() => {
	wkProps = new PropertiesImpl();
	wkProps.load(PROPS);
	lf = new LoggerFactoryImpl(wkProps);
});

afterAll(() => {
	wkProps = null;
	lf = null;
});

let specimen: Setter = null;
beforeEach(() => {
	specimen = new Setter(wkExpr, lf.getLogger(`Setter: ${ wkExpr }`));
});

afterEach(() => {
	specimen = null;
});

test("new Setter", () => {
	expect(specimen).not.toBeNull();
});

test("set(scope, value)", () => {
	const spyScope = spy(new ScopeImpl());
	const spySetter: Setter<any> = spy(specimen);
	specimen.set(spyScope, "bubba");
	verify(spySetter.set(spyScope, "bubba")).once();
	specimen.set(new ScopeImpl(), "bubba");
});
