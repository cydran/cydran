import { IdGenerator } from "Component";

test("codes generated", () => {
	const instance: IdGenerator = new IdGenerator();
	expect(instance.generate()).toEqual("0-0-0");
	expect(instance.generate()).toEqual("0-0-1");
	expect(instance.generate()).toEqual("0-0-2");
	expect(instance.generate()).toEqual("0-0-3");
	expect(instance.generate()).toEqual("0-0-4");
	expect(instance.generate()).toEqual("0-0-5");
});
