import { Registry, RegistryImpl } from "@/Registry";
import { assert, expect } from "chai";
import { describe, it } from "mocha";
import { anything, instance, mock, verify, when } from "ts-mockito";

describe("Registry tests", () => {

	let pCnt: number = 0;
	const wkv: string = "Whatever";
	const wkn: string = "proto_";

	class TestObj {

		private name: string;

		private value: string;

		constructor() {
			this.name = wkn + pCnt++;
			this.value = wkv;
		}

		public getName(): string {
			return this.name;
		}

		public getValue(): string {
			return this.value;
		}

	}

	it("RegistryImpl.INSTANCE", () => {
		assert.isNotNull(RegistryImpl.INSTANCE, "is null");
	});

	it("registerConstant(id, value)", () => {
		const key: string = "const_X";
		const value = "Whatever";
		RegistryImpl.INSTANCE.registerConstant(key, value);
		assert.equal(value, RegistryImpl.INSTANCE.get(key), "not same value for key of '" + key + "'");
	});

	it("registerPrototype(id, class)", () => {
		const k: string = wkn;
		const v: TestObj = new TestObj();
		const nr: Registry = RegistryImpl.INSTANCE.registerPrototype(v.getName(), TestObj);
		assert.equal(nr, RegistryImpl.INSTANCE, "not same Registry");

		const wkName = v.getName();
		const robj1: TestObj = nr.get(wkName);
		const robj2: TestObj = nr.get(wkName);

		assert.notEqual(v, robj1, "not the same object reference");
		assert.equal(robj2.getValue(), robj1.getValue(), "not same value for 'value' key");
		assert.notEqual(robj2.getName(), robj1.getName(), "same value for 'name' key of '" + wkName + "'");
	});

	it("registerSingleton(id, class)", () => {
		const v: TestObj = new TestObj();
		const nr: Registry = RegistryImpl.INSTANCE.registerSingleton(v.getName(), TestObj);
		assert.equal(nr, RegistryImpl.INSTANCE, "not same Registry");

		const wkName = v.getName();
		const robj1: TestObj = nr.get(wkName);
		const robj2: TestObj = nr.get(wkName);

		assert.notEqual(v, robj1, "same object reference");
		assert.equal(robj2, robj1, "not same object reference");
		assert.equal(robj2.getValue(), robj1.getValue(), "not same value for 'value' key");
		assert.equal(robj2.getName(), robj1.getName(), "not same value for 'name' key of '" + wkName + "'");
	});

	it.skip("addStrategy(strategy)", () => {
		const mockRegistry: RegistryImpl = mock(RegistryImpl.INSTANCE);
		// r.addStrategy();
		// verify(mockRegistry.addStrategy(TestRS)).once();
	});

});
