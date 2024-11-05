// TODO - Migrate this out of the /src/ folder

import { isDefined, requireNotNull } from 'util/Utils';
import Messages from 'util/Messages';
import SimpleMap from "interface/SimpleMap";
import Type from "interface/Type";
import Instantiator from "registry/Instantiator";

class NullTester {

	private factories: SimpleMap<() => any>;

	constructor() {
		this.factories = {};
	}

	public addFactory(name: string, factory: () => any): NullTester {
		requireNotNull(name, "name");
		requireNotNull(factory, "factory");

		this.factories[name] = factory;

		return this;
	}

	public testConstructor(type: Type<any>, args: string[]): void {
		requireNotNull(type, "type");
		requireNotNull(args, "args");

		for (const arg of args) {
			if (!isDefined(arg)) {
				continue;
			}

			if (!isDefined(this.factories[arg])) {
				throw new Error("Unknown factory: " + arg);
			}
		}

		for (let i: number = 0; i < args.length; i++) {
			if (!isDefined(args[i])) {
				continue;
			}

			const constructorArgs: any[] = [];

			for (const arg of args) {
				const value: any = isDefined(arg) ? this.factories[arg]() : null;
				constructorArgs.push(value);
			}

			constructorArgs[i] = null;

			let thrown: Error = null;

			try {
				const fn: any = Instantiator.create(type);
				fn.apply({}, constructorArgs);
			} catch (e) {
				thrown = e;
			}

			if (!isDefined(thrown)) {
				throw new Error("No error thrown at argument: " + args[i]);
			}

			const expected: string = args[i] + " shall not be null";

			if (expected !== thrown.message) {
				throw new Error("Unexpected error message at argument: " + args[i] + ", Expected: '" + expected + "', Actual: '" + thrown.message + "'");
			}
		}
	}

	public testMethod(thisObject: Object, method: Function, args: string[]): void {
		requireNotNull(thisObject, "thisObject");
		requireNotNull(method, "method");
		requireNotNull(args, "args");

		for (const arg of args) {
			if (!isDefined(arg)) {
				continue;
			}

			if (!isDefined(this.factories[arg])) {
				throw new Error("Unknown factory: " + arg);
			}
		}

		for (let i: number = 0; i < args.length; i++) {
			if (!isDefined(args[i])) {
				continue;
			}

			const methodArgs: any[] = [];

			for (const arg of args) {
				const value: any = isDefined(arg) ? this.factories[arg]() : null;
				methodArgs.push(value);
			}

			methodArgs[i] = null;

			let thrown: Error = null;

			try {
				method.apply(thisObject, methodArgs);
			} catch (e) {
				thrown = e;
			}

			if (!isDefined(thrown)) {
				throw new Error("No error thrown at argument: " + args[i]);
			}

			const expected: string = args[i] + " shall not be null";

			if (expected !== thrown.message) {
				throw new Error("Unexpected error message at argument: " + args[i] + ", Expected: '" + expected + "', Actual: '" + thrown.message + "'");
			}
		}
	}

}

function assertThrown(expected: string, activity: () => void, expectedType?: string) {
	assertNullGuarded(expected, activity, expectedType);
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

	if (thrown.message !== actualExpected) {
		const errors: Messages = new Messages("must have correct message");
		errors.add("Expected: " + actualExpected);
		errors.add("Actual: " + thrown.message);
		throw new Error(errors.getMessages());
	}

	if (thrown.name !== actualExpectedType) {
		const errors: Messages = new Messages("must have correct name");
		errors.add("Expected: " + actualExpectedType);
		errors.add("Actual: " + thrown.name);
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
		throw new Error("error must not be thrown: " + thrown.message);
	}
}

async function triggerGcAsync(): Promise<void> {
	await new Promise(resolve => setTimeout(resolve, 0));
	global.gc();
}

export { assertNullGuarded, assertThrown, assertNoErrorThrown, NullTester, triggerGcAsync };

