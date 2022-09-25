import DomImpl from 'dom/DomImpl';
import Services from "service/Services";
import ServicesImpl from "service/ServicesImpl";
import PropertiesImpl from 'properties/PropertiesImpl';

let specimen: Services = null;

beforeEach(() => {
	specimen = new ServicesImpl(new DomImpl(), new PropertiesImpl());
});

afterEach(() => {
	specimen = null;
});

test("Instantiated", () => {
	expect(specimen).not.toBeNull();
});

