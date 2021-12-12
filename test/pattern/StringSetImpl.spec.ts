import StringSetImpl from "pattern/StringSetImpl";

let specimen: StringSetImpl = null;

const wkVal: string = "bubbalicious";

beforeEach(() => {
	specimen = new StringSetImpl();
	specimen.add(wkVal);
});

afterEach(() => {
	specimen = null;
});

test("non-null instance", () => {
	expect(specimen).not.toBe(null);
});

test("add & contains value", () => {
	expect(specimen).not.toBe(null);

	const result1: boolean = specimen.contains(wkVal);
	expect(result1).toBe(true);

	const wkVal2: string = (wkVal + '1');
	const result2: boolean = specimen.contains(wkVal2);
	expect(result2).toBe(false);

	const wkVal3: string = wkVal.toUpperCase();
	const result3: boolean = specimen.contains(wkVal3);
	expect(result3).toBe(false);
});

test("remove value", () => {
	expect(specimen).not.toBe(null);

	const result1: boolean = specimen.contains(wkVal);
	expect(result1).toBe(true);

	const wkVal2: string = (wkVal + '1');
	specimen.remove(wkVal2);
	const result2: boolean = specimen.contains(wkVal2);
	expect(result2).toBe(false);

	specimen.remove(wkVal);
	const result3: boolean = specimen.contains(wkVal);
	expect(result2).toBe(false);

});

test("clear, size, isPopulated, and isEmpty", () => {
	expect(specimen).not.toBe(null);

	const result1: boolean = specimen.contains(wkVal);
	expect(result1).toBe(true);

	const resultSize: number = specimen.size();
	expect(resultSize).toBe(1);
	expect(specimen.isEmpty()).toBe(false);
	expect(specimen.isPopulated()).toBe(true);

	specimen.clear();
	expect(specimen.size()).toBe(0);
	expect(specimen.isEmpty()).toBe(true);
	expect(specimen.isPopulated()).toBe(false);

	const wkSizer: number = 7;
	for(let x: number = 0; x < wkSizer; x++) {
		specimen.add(wkVal + x);
	}
	expect(specimen.size()).toBe(wkSizer);
	expect(specimen.isEmpty()).toBe(false);
	expect(specimen.isPopulated()).toBe(true);

	specimen.clear()
	expect(specimen.size()).toBe(0);
	expect(specimen.isEmpty()).toBe(true);
	expect(specimen.isPopulated()).toBe(false);

});
