import { CydranError } from "@/error/AbstractCydranError";

class TestError extends CydranError {

	constructor(msg: string, reps?: any) {
		super(msg, reps);
	}

}

const emsg: string = "test error";

test("new TestError()", () => {
	const errobj = new TestError(emsg);
	expect(errobj).toBeInstanceOf(Error);
});

test("this instanceof Error", () => {
	const errobj = new TestError(emsg);
	expect(errobj).not.toBeNull();
	expect(errobj).toBeInstanceOf(Error);
});

test("provides the correct message", () => {
	const errobj = new TestError(emsg);
	expect(emsg).toEqual(errobj.message);
});

test("provides the correct message with substitution values", () => {
	const setmsg = "We are going to %activity% all night long in the city of %city%, %country%.";
	const expected = "We are going to sing all night long in the city of Venice, Italy.";
	const subvals = {
		"%activity%": "sing",
		"%city%": "Venice",
		"%country%": "Italy"
	};

	const errobj = new TestError(setmsg, subvals);
	expect(expected).toEqual(errobj.message);
});
