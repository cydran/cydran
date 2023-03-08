import IdGenerator from 'util/IdGenerator';

test("codes generated - pristine", () => {
	const cnt: number = 6;

	const result: string[] = [];
	for(let x = 0; x < cnt; x++) {
		result.push(IdGenerator.generate());
		expect(result[x]).toEqual(`0-0-${x}`);
	}
});
