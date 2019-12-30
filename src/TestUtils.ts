import { assert } from "chai";

function assertNullGuarded(expected: string, activity: () => void, expectedType?: string) {
	const actualExpectedType = (expectedType === null || expectedType === undefined) ? "NullValueError" : expectedType;
	let thrown: Error = null;

	const actualExpected: string = expected.includes(" ") ? expected : expected + " shall not be null";

	try {
		activity();
	} catch (e) {
		thrown = e;
	}

	assert.isNotNull(thrown, "error must be thrown");
	assert.equal(thrown.name, actualExpectedType, "must have correct name");
	assert.equal(thrown.message, actualExpected, "must have correct message");
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

