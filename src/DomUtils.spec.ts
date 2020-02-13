import DomUtils from "@/DomUtils";
import { assert, expect } from "chai";
import { describe, it } from "mocha";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";

describe("DomUtils tests", () => {

	class TestWork {
		private workMsg: string;

		constructor(msg: string) {
			this.workMsg = msg;
		}

		public getMessage() {
			return this.workMsg;
		}
	}

	it.skip("domReady()", () => {
		const testWork: TestWork = new TestWork("doing test work");
		const result: string = testWork.getMessage();
		assert.equal("doing test work", result, "not equal");
	});

});
