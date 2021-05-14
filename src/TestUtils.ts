// TODO - Migrate this out of the /src/ folder

import { isDefined } from "util/Utils";


function assertNullGuarded(expected: string, activity: () => void, expectedType?: string) {
	const actualExpectedType = (expectedType === null || expectedType === undefined) ? "NullValueError" : expectedType;
	let thrown: Error = null;

	const actualExpected: string = expected.includes(" ") ? expected : `${ expected } shall not be null`;

	try {
		activity();
	} catch (e) {
		thrown = e;
	}

	if (!isDefined(thrown)) {
		throw new Error("error must be thrown");
	}

	if (thrown.name !== actualExpectedType) {
		throw new Error("must have correct name");
	}

	if (thrown.message !== actualExpected) {
		throw new Error("must have correct message");
	}
}

function assertNoErrorThrown(activity: () => void) {
	let thrown: Error = null;

	try {
		activity();
	} catch (e) {
		thrown = e;
	}

	if (isDefined(thrown)) {
		throw new Error("error must not be thrown");
	}
}

export { assertNullGuarded, assertNoErrorThrown };

