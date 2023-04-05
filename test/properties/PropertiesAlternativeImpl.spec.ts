import PropertiesAlternativeImpl from "properties/PropertiesAlternativeImpl";
import { MutableProperties } from 'properties/Property';

test("PropertiesImpl instantiates and available", () => {
	const properties: MutableProperties = new PropertiesAlternativeImpl();
	const namedResults: string[] = [];
	const generalResults: string[] = [];
	const namedCallback: (value: string) => void = (value: string) => namedResults.push(value);
	const generalCallback: (name: string, value: string) => void = (name: string, value: string) => generalResults.push(name + " - " + value);

	properties.addObserver(generalCallback);
	properties.addPropertyObserver("my-property", namedCallback);

	properties.set("my-property", "foo");
	properties.set("my-property", "bar");

	properties.removeObserver(generalCallback);
	properties.removePropertyObserver("my-property", namedCallback);

	properties.set("my-property", "bat");
	properties.set("my-property", "baz");

	expect(namedResults.length).toEqual(2);
	expect(namedResults[0]).toEqual("foo");
	expect(namedResults[1]).toEqual("bar");

	expect(generalResults.length).toEqual(2);
	expect(generalResults[0]).toEqual("my-property - foo");
	expect(generalResults[1]).toEqual("my-property - bar");
});
