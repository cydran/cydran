// TODO - Migrate this out of the /src/ folder

import { isDefined, requireNotNull } from 'util/Utils';
import Messages from 'util/Messages';
import SimpleMap from "interface/SimpleMap";
import Type from "interface/Type";

class ConstructorTester {

	private factories: SimpleMap<() => any>;

	constructor() {
		this.factories = {};
	}

	public addFactory(name: string, factory: () => any): ConstructorTester {
		requireNotNull(name, "name");
		requireNotNull(factory, "factory");

		this.factories[name] = factory;

		return this;
	}

	public test(type: Type<any>, args: string[], expectedErrors: SimpleMap<string>): void {
		requireNotNull(type, "type");
		requireNotNull(args, "args");

		// TODO - Check factories

		// TODO - Construct and check

	}

}

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
		const errors: Messages = new Messages("must have correct name");
		errors.add("Expected: " + actualExpectedType);
		errors.add("Actual: " + thrown.name);
		throw new Error(errors.getMessages());
	}

	if (thrown.message !== actualExpected) {
		const errors: Messages = new Messages("must have correct message");
		errors.add("Expected: " + actualExpected);
		errors.add("Actual: " + thrown.message);
		throw new Error(errors.getMessages());
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

export { assertNullGuarded, assertNoErrorThrown, ConstructorTester };

