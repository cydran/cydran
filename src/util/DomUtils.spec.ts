import { JSDOM } from "jsdom";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import { domReady } from "@/util/DomUtils";

const win = new JSDOM("<div id='whack' c:click='m().doWork()'></div>").window;
const doc = win.document;

function writeConsole() {
	expect(true).toEqual(true);
	// console.log("\t--- domReady is ready");
}

test("domReady(callback?: any, context?: any)", () => {
	domReady(() => writeConsole());
});
