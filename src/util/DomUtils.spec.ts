import { assert, expect } from "chai";
import { JSDOM } from "jsdom";
import { describe, it, xit } from "mocha";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import DomUtils from "@/util/DomUtils";

describe("DomUtils tests", () => {
	const win = new JSDOM("<div id='whack' c:click='m().doWork()'></div>").window;
	const doc = win.document;

	function writeConsole() {
		assert.isTrue(true);
		// console.log("\t--- domReady is ready");
	}

	it("domReady(callback?: any, context?: any)", () => {
		DomUtils.domReady(() => writeConsole());
	});

});
