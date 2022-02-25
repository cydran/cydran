import IdGenerator from 'util/IdGenerator';

test("codes generated - pristine", () => {
	const instance: IdGenerator = IdGenerator.INSTANCE;
	const cnt: number = 6;

	const result: string[] = [];
	for(let x = 0; x < cnt; x++) {
		result.push(instance.generate());
		expect(result[x]).toEqual(`0-0-${x}`);
	}
	console.log(`increment from pristine: ${ JSON.stringify(result) }`);
});

test("codes generated - roll micro", () => {
	const instance: IdGenerator = new IdGenerator(undefined, undefined, 6, 6);
	const maxCnt = instance.upperBoundary();

	const result: string[] = [];
	result.push(instance.generate());
	expect(result[0]).toEqual(`0-0-${maxCnt}`);
	for(let x = 0; x < maxCnt; x++) {
		result.push(instance.generate());
		expect(result[x + 1]).toEqual(`0-1-${x}`);
	}
	console.log(`rolling micro: ${ JSON.stringify(result) }`);
});

test("codes generated - roll minor", () => {
	const instance: IdGenerator = new IdGenerator(undefined, 6, 6, 6);
	const maxCnt = instance.upperBoundary();

	const result: string[] = [];
	result.push(instance.generate());
	expect(result[0]).toEqual(`0-${maxCnt}-${maxCnt}`);
	for(let x = 0; x < maxCnt; x++) {
		result.push(instance.generate());
		expect(result[x + 1]).toEqual(`1-0-${x}`);
	}
	console.log(`rolling minor: ${ JSON.stringify(result) }`);
});
