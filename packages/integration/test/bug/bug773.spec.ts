import { Component } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";
import { describe, expect, test } from '@jest/globals';

const EXPECTED_BODY_BEFORE: string = `<!--SS--><!--SE--><div></div><!--SS--><!--SE-->`;

class TestComponent extends Component {

	constructor() {
		super(`<div></div>`);
	}

}

class CallbackValues<T> {

	private values: T[];

	constructor() {
		this.values = [];
	}


	public getValues(): T[] {
		return this.values;
	}

	public onChange(value: unknown): void {
		this.values.push(value as T);
	}

}

describe("Bug 773 - Duplicate callback execution on property observation", () => {

	test("Property callbacks fire the correct number of times", () => {
		const values: CallbackValues<string> = new CallbackValues<string>();

		const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent());
		harness.start();
		harness.expectBody().toEqual(EXPECTED_BODY_BEFORE);
		harness.getContext().getProperties().addPropertyObserver("testProperty", values, values.onChange);
		harness.getContext().getProperties().set("testProperty", "value0");
		harness.getContext().getProperties().set("testProperty", "value1");
		harness.getContext().getProperties().set("testProperty", "value2");
		harness.getContext().getProperties().set("testProperty", "value3");

		expect(values.getValues()).toEqual(["value0", "value1", "value2", "value3"]);
	});

});
