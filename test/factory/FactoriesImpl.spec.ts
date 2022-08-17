import Factories from "factory/Factories";
import DomImpl from "dom/DomImpl";
import InstanceServicesImpl from "context/InstanceServicesImpl";
import DigestionContext from "digest/DigestionContext";
import InternalPropertyKeys from "const/InternalPropertyKeys";
import { Properties } from 'properties/Property';
import PropertiesImpl from "properties/PropertiesImpl";

let spec: Factories = null;
let internalProps: Properties = null;

const PROPS = {
	[InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_DIGESTOR]: "cifd",
	[InternalPropertyKeys.CYDRAN_INTERNAL_FACTORY_DIGESTION_CONTEXT]: "cifdc",
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
	spec = (new InstanceServicesImpl(new DomImpl(), {})).getFactories();
});

afterEach(() => {
	spec = null;
});

test("instance is whole and ready", () => {
	expect(spec).not.toBeNull();
});

test("createDigestionContext()", () => {
	const wkSpy = jest.spyOn(spec, 'createDigestionContext');
	const result: DigestionContext = spec.createDigestionContext();
	expect(result).not.toBeNull();
	expect(wkSpy).toBeCalledTimes(1);
});

test("importFactories(props)", () => {
	const wkSpy = jest.spyOn(spec, 'importFactories');
	const result: DigestionContext = spec.importFactories(internalProps);
	expect(result).not.toBeNull();
	expect(wkSpy).toBeCalledTimes(1);
});
