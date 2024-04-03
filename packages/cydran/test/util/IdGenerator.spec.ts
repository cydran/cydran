import { IdGenerator, IdGeneratorState } from "util/IdGenerator";

let specimen: IdGeneratorState = null;

beforeEach(() => {
	specimen = new IdGeneratorState();
});

afterEach(() => {
	specimen = null;
});

test("IdGeneratorState - from scratch", () => {
	const val = specimen.generate();
	expect(val).toEqual('0-0-0');
	specimen = new IdGeneratorState(0, 0, 9007199254740989);
	specimen.generate();
	expect(specimen.generate()).toEqual('0-1-0');
	specimen = new IdGeneratorState(0, 9007199254740989, 9007199254740989);
	expect(specimen.generate()).toEqual('0-9007199254740989-9007199254740989');
	expect(specimen.generate()).toEqual('1-0-0');
	specimen = new IdGeneratorState(9007199254740989, 9007199254740989, 9007199254740989);
	expect(specimen.generate()).toEqual('9007199254740989-9007199254740989-9007199254740989');
	expect(specimen.generate()).toEqual('0-0-0');
	expect(specimen.generate()).toEqual('0-0-1');
});

test("codes generated - pristine", () => {
	const cnt: number = 6;

	const result: string[] = [];
	for(let x = 0; x < cnt; x++) {
		result.push(IdGenerator.generate());
		expect(result[x]).toEqual(`0-0-${x}`);
	}
});

test("upperBoundary", () => {
	const upper: number = 9007199254740989;
	const result: number = IdGenerator.upperBoundary();
	expect(result).toEqual(upper);
})


