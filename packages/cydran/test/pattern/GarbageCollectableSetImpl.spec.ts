import GarbageCollectableSetImpl from "pattern/GarbageCollectableSetImpl";
import { triggerGcAsync } from "test/TestUtils";
import { beforeEach, describe, expect, test } from '@jest/globals';
require('expose-gc');

class Callbacks {

	private values: string[] = [];

	public alpha(value: string): void {
		this.values.push("Alpha:" + value);
	}

	public beta(value: string): void {
		this.values.push("Beta:" + value);
	}

	public gamma(value: string): void {
		this.values.push("Gamma:" + value);
	}

	public getValues(): string[] {
		return this.values;
	}

}

describe("IterableGarbageCollectableSetImpl", () => {

	let specimen: GarbageCollectableSetImpl<object, object>;

	beforeEach(() => {
		specimen = new GarbageCollectableSetImpl();
	});

	test("add() - Item is added and available on a forEach", () => {
		const callbacks = new Callbacks();
		specimen.add(callbacks.alpha, callbacks);
		specimen.add(callbacks.gamma, callbacks);

		specimen.forEach((callback: Function, thisObject: Callbacks) => {
			callback.call(thisObject, "Value");
		});

		expect(callbacks.getValues()).toEqual([
			"Alpha:Value",
			"Gamma:Value"
		]);
	});

	test("remove() - Item is removed and not available on a forEach", () => {
		const callbacks = new Callbacks();
		specimen.add(callbacks.alpha, callbacks);
		specimen.add(callbacks.beta, callbacks);
		specimen.add(callbacks.gamma, callbacks);

		specimen.remove(callbacks.beta, callbacks);

		specimen.forEach((callback: Function, thisObject: Callbacks) => {
			callback.call(thisObject, "Value");
		});

		expect(callbacks.getValues()).toEqual([
			"Alpha:Value",
			"Gamma:Value"
		]);
	});

	test("forEach() - All items are called", () => {
		const callbacks = new Callbacks();
		specimen.add(callbacks.alpha, callbacks);
		specimen.add(callbacks.beta, callbacks);
		specimen.add(callbacks.gamma, callbacks);

		specimen.forEach((callback: Function, thisObject: Callbacks) => {
			callback.call(thisObject, "Value");
		});

		expect(callbacks.getValues()).toEqual([
			"Alpha:Value",
			"Beta:Value",
			"Gamma:Value"
		]);
	});

	test("clear() - All items are removed", () => {
		const callbacks = new Callbacks();
		specimen.add(callbacks.alpha, callbacks);
		specimen.add(callbacks.beta, callbacks);
		specimen.add(callbacks.gamma, callbacks);

		specimen.clear();
		specimen.forEach((callback: Function, thisObject: Callbacks) => {
			callback.call(thisObject, "Value");
		});

		expect(callbacks.getValues()).toEqual([]);
	});

	test("Garbage collection - Objects no longer referenced are let go", async () => {
		const results: string[] = [];
		let callback0: (value: string) => void = (value: string) => results.push("Callback0:" + value);
		let callback1: (value: string) => void = (value: string) => results.push("Callback1:" + value);
		let callback2: (value: string) => void = (value: string) => results.push("Callback2:" + value);

		specimen.add(callback0);
		specimen.add(callback1);
		specimen.add(callback2);

		callback1 = null as unknown as (value: string) => void;
		
		await triggerGcAsync();

		specimen.forEach((callback: Function) => {
			callback("Value");
		});

		expect(results).toEqual([
			"Callback0:Value",
			"Callback2:Value"
		]);		
	});

});