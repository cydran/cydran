import { mock, spy, verify } from "ts-mockito";
import Getter from 'mediator/Getter';
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

let specimen: Getter = null;
beforeEach(() => {
	specimen = new Getter(wkExpr, lf.getLogger(`Getter: ${ wkExpr }`));
});

afterEach(() => {
	specimen = null;
});

test("new Getter", () => {
	expect(specimen).not.toBeNull();
});

test("set(scope)", () => {
	const scope = new ScopeImpl();
	scope.add("var1", "Bubba");
	const spySetter: Getter<any> = spy(specimen);
	specimen.get(scope);
	verify(spySetter.get(scope)).once();
	specimen.get(new ScopeImpl());
});
