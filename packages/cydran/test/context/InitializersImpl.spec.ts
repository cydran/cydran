import Initializers from "context/Initializers";
import InitializersImpl from "context/InitializersImpl";
import { describe, beforeEach, afterEach, test, expect, jest } from '@jest/globals';

const b: string = "boo" as const;

class WorkObj {
	private id: string;

	constructor(id: string) {
		this.id = id;
	}

	doWork() {
		console.log(`wkObj.id: ${this.id}`);
	}
}

let specimen: Initializers;

describe("InitializersImpl", () => {

	beforeEach(() => {
		specimen = new InitializersImpl<Object>();
	});

	afterEach(() => {
		specimen = null;
	});

	test("add callback", () => {
		const wkObj: WorkObj = new WorkObj(b);
		const wkSpy: Initializers = jest.spyOn(specimen, "add");
		specimen.add(null, wkObj => wkObj.doWork());
		expect(wkSpy).toBeCalledTimes(1);
	});

	test("add bad callback", () => {
		const wkObj: WorkObj = new WorkObj(b);
		const wkSpy: Initializers = jest.spyOn(specimen, "add");
		expect(() => specimen.add(null, null)).toThrowError();
		expect(wkSpy).toBeCalledTimes(1);
	});

	test("execute", () => {
		const wkObj: WorkObj = new WorkObj(b);
		const wkSpy: Initializers = jest.spyOn(specimen, "execute");
		specimen.add(null, wkObj => wkObj.doWork());
		specimen.execute(wkObj);
		expect(wkSpy).toBeCalledTimes(1);
	});

});
