import { assert, expect } from "chai";
import { describe, it } from "mocha";
import Mockito from "ts-mockito";
import { anything, instance, mock, verify, when } from "ts-mockito";
import { Registry, RegistryImpl } from "../src/Registry";
import RegistryStrategy from "../src/RegistryStrategy";

describe("Registry tests", () => {

	let pCnt: number = 0;
	const r: RegistryImpl = RegistryImpl.INSTANCE;
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
		assert.isNotNull(r, "is null");
	});

	it("registerConstant(id, value)", () => {
		const k = "const_X", v = "Whatever";
		const nr: Registry = r.registerConstant(k, v);
		assert.equal(nr, r, "not same Registry");
		assert.equal(v, nr.get(k), "not same value for key of '" + k + "'");
	});

	it("registerPrototype(id, class)", () => {
		const k: string = wkn;
		const v: TestObj = new TestObj();
		const nr: Registry = r.registerPrototype(v.getName(), TestObj);
		assert.equal(nr, r, "not same Registry");

		const wkName = v.getName();
		const robj1: TestObj = nr.get(wkName);
		const robj2: TestObj = nr.get(wkName);

		assert.notEqual(v, robj1, "not the same object reference");
		assert.equal(robj2.getValue(), robj1.getValue(), "not same value for 'value' key");
		assert.notEqual(robj2.getName(), robj1.getName(), "same value for 'name' key of '" + wkName + "'");
	});

	it("registerSingleton(id, class)", () => {
		const v: TestObj = new TestObj();
		const nr: Registry = r.registerSingleton(v.getName(), TestObj);
		assert.equal(nr, r, "not same Registry");

		const wkName = v.getName();
		const robj1: TestObj = nr.get(wkName);
		const robj2: TestObj = nr.get(wkName);

		assert.notEqual(v, robj1, "same object reference");
		assert.equal(robj2, robj1, "not same object reference");
		assert.equal(robj2.getValue(), robj1.getValue(), "not same value for 'value' key");
		assert.equal(robj2.getName(), robj1.getName(), "not same value for 'name' key of '" + wkName + "'");
	});

	it.skip("addStrategy(strategy)", () => {
		const mockRegistry: RegistryImpl = mock(r);
		//r.addStrategy();
		//verify(mockRegistry.addStrategy(TestRS)).once();
	});

});
