import PropertiesAlternativeImpl from "properties/PropertiesAlternativeImpl";
import { MutableProperties, Properties } from 'properties/Property';

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

test("PropertiesImpl property inheritance", () => {
	const parent: MutableProperties = new PropertiesAlternativeImpl();
	const child: MutableProperties = parent.extend();
	const grandChild: MutableProperties = child.extend();

	parent.set("alpha", "foo0");
	parent.set("beta", "bar0");
	parent.set("gamma", "bat0");
	child.set("alpha", "foo1");
	child.set("beta", "bar1");
	grandChild.set("alpha", "foo2");

	expect(parent.get("alpha")).toEqual("foo0");
	expect(parent.get("beta")).toEqual("bar0");
	expect(parent.get("gamma")).toEqual("bat0");
	expect(child.get("alpha")).toEqual("foo1");
	expect(child.get("beta")).toEqual("bar1");
	expect(child.get("gamma")).toEqual("bat0");
	expect(grandChild.get("alpha")).toEqual("foo2");
	expect(grandChild.get("beta")).toEqual("bar1");
	expect(grandChild.get("gamma")).toEqual("bat0");
});
