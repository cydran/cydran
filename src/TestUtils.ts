import { assert } from "chai";

function assertNullGuarded(expected: string, activity: () => void) {
	let thrown: Error = null;

	try {
		activity();
	} catch (e) {
		thrown = e;
	}

	assert.isNotNull(thrown, "error must be thrown");
	assert.equal(thrown.name, "NullValueError", "must have correct name");
	assert.equal(thrown.message, expected + " shall not be null", "must have correct message");
}

function assertNoErrorThrown(activity: () => void) {
	let thrown: Error = null;

	try {
		activity();
	} catch (e) {
		thrown = e;
	}

	assert.isNull(thrown, "error must not be thrown");
}

export { assertNullGuarded, assertNoErrorThrown };

