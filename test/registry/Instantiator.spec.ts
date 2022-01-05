import Instantiator from 'registry/Instantiator';

class TestObjA {

	private first: string;

	constructor() {
		this.first = "fixed value";
	}

	public getFirst(): string {
		return this.first;
	}

}

class TestObjB {

	private first: string;

	constructor(first: string, second: string) {
		this.first = first;
	}

	public getFirst(): string {
		return this.first;
	}

}

class TestObjC {

	private first: string;

	private second: string;

	constructor(first: string, second: string) {
		this.first = first;
		this.second = second;
	}

	public getFirst(): string {
		return this.first;
	}

	public getSecond(): string {
		return this.second;
	}

}

test("Instantiator.create() - No arguments", () => {
	const result: TestObjA = Instantiator.create(TestObjA)();

	expect(result).not.toBeNull();
	expect(result.getFirst()).toEqual("fixed value");
});

test("Instantiator.create() - One argument", () => {
	const result: TestObjB = Instantiator.create(TestObjB)("first");

	expect(result).not.toBeNull();
	expect(result.getFirst()).toEqual("first");
});

test("Instantiator.create() - Two arguments", () => {
	const result: TestObjC = Instantiator.create(TestObjC)("first", "second");

	expect(result).not.toBeNull();
	expect(result.getFirst()).toEqual("first");
	expect(result.getSecond()).toEqual("second");
});
