import { assert } from "chai";
import { describe, it, xit } from "mocha";
import { CydranError, NEWI } from "./AbstractCydranError";

class TestError extends CydranError {

	constructor(msg: string, reps?: any) {
		if (!new.target) { throw (new.target + NEWI); }
		super(msg, reps);
	}

}

describe("AbstractCydranError tests", () => {

	it("new TestError()", () => {
		const setmsg = "We are here.";
		const errobj = new TestError(setmsg);
		assert.isNotNull(errobj, "is null");
	});

	it("this instanceof Error", () => {
		const setmsg = "We are here.";
		const errobj = new TestError(setmsg);
		assert.isTrue(errobj instanceof Error);
		assert.isNotNull(errobj, "is not an instance of Error");
	});

	it("provides the correct message", () => {
		const setmsg = "We are here.";
		const errobj = new TestError(setmsg);
		assert.equal(setmsg, errobj.message, "message not correct");
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
