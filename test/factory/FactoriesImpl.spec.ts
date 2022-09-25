import Factories from "factory/Factories";
import DomImpl from "dom/DomImpl";
import ServicesImpl from "service/ServicesImpl";
import DigestionState from "digest/DigestionState";
import InternalPropertyKeys from "const/InternalPropertyKeys";
import { Properties } from 'properties/Property';
import PropertiesImpl from "properties/PropertiesImpl";

let spec: Factories = null;
let internalProps: Properties = null;

const PROPS = {
	[InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_DIGESTOR]: "cifd",
	[InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_DIGESTION_STATE]: "cifds",
	[InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_SEGMENT_DIGESTER]: "cifsd"
};

beforeAll(() => {
	internalProps = new PropertiesImpl();
	internalProps.load(PROPS);
});

afterAll(() => {
	internalProps = null;
});

beforeEach(() => {
	spec = (new ServicesImpl(new DomImpl(), internalProps)).getFactories();
});

afterEach(() => {
	spec = null;
});

test("instance is whole and ready", () => {
	expect(spec).not.toBeNull();
});

test("createDigestionState()", () => {
	const wkSpy = jest.spyOn(spec, 'createDigestionState');
	const result: DigestionState = spec.createDigestionState();
	expect(result).not.toBeNull();
	expect(wkSpy).toBeCalledTimes(1);
});

test("importFactories(props)", () => {
	const wkSpy = jest.spyOn(spec, 'importFactories');
	const result: DigestionState = spec.importFactories(internalProps);
	expect(result).not.toBeNull();
	expect(wkSpy).toBeCalledTimes(1);
});
