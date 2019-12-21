import { assert, expect } from "chai";
import { describe, it, xit } from "mocha";
import { CydranError, NEWI } from "@/error/AbstractCydranError";

class TestError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

describe("CydranError tests", () => {
	const emsg: string = "test error";

	it("new TestError()", () => {
		const errobj = new TestError(emsg);
		expect(errobj).to.be.an('error');
		expect(errobj instanceof Error).to.be.equal(true);
	});

	it("this instanceof Error", () => {
		const errobj = new TestError(emsg);
		assert.isTrue(errobj instanceof Error);
		assert.isNotNull(errobj, "is not an instance of Error");
	});

	it("provides the correct message", () => {
		const errobj = new TestError(emsg);
		assert.equal(emsg, errobj.message, "message not correct");
	});

	it("provides the correct message with substitution values", () => {
		const setmsg = "We are going to %activity% all night long in the city of %city%, %country%.";
		const expected = "We are going to sing all night long in the city of Venice, Italy.";
		const subvals = {
			"%activity%": "sing",
			"%city%": "Venice",
			"%country%": "Italy",
		};
		const errobj = new TestError(setmsg, subvals);
		assert.equal(expected, errobj.message, "message not correct");
	});

});
