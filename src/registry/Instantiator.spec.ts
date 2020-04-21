import { Registry, RegistryImpl } from "@/registry/Registry";import { assertNullGuarded } from "@/util/TestUtils";
import { assert } from "chai";
import { describe, it } from "mocha";
import Instantiator from "@/registry/Instantiator";

describe("Instantiator tests", () => {

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

	it("Instantiator.create() - No arguments", () => {
		const result: TestObjA = Instantiator.create(TestObjA)();

		assert.isNotNull(result, "is null");
		assert.equal(result.getFirst(), "fixed value");
	});

	it("Instantiator.create() - One argument", () => {
		const result: TestObjB = Instantiator.create(TestObjB)("first");

		assert.isNotNull(result, "is null");
		assert.equal(result.getFirst(), "first");
	});

	it("Instantiator.create() - Two arguments", () => {
		const result: TestObjC = Instantiator.create(TestObjC)("first", "second");

		assert.isNotNull(result, "is null");
		assert.equal(result.getFirst(), "first");
		assert.equal(result.getSecond(), "second");
	});

});
