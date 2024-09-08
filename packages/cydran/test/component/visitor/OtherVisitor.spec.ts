import OtherVisitor from "component/visitor/OtherVisitor";
import GlobalContextImpl from 'context/GlobalContextImpl';
import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';

let visitor: OtherVisitor = null;

describe("OtherVisitor", () => {

	beforeEach(() => {
		visitor = new OtherVisitor(new GlobalContextImpl());
	});

	afterEach(() => {
		visitor = null;
	});

	test("instance is good", () => {
		expect(visitor).not.toBeNull();
	});

});
