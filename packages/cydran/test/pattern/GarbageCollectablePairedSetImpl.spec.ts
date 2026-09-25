import GarbageCollectablePairedSetImpl from "pattern/GarbageCollectablePairedSetImpl";
import { triggerGcAsync } from "test/TestUtils";
import { beforeEach, describe, expect, test } from '@jest/globals';

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

describe("GarbageCollectablePairedSetImpl", () => {

	let specimen: GarbageCollectablePairedSetImpl<object, object, object>;

	beforeEach(() => {
		specimen = new GarbageCollectablePairedSetImpl<object, object, object>();
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

	function createCallback(results: string[], id: number): (value: string) => void {
		let callback: (value: string) => void = (value: string) => results.push("Callback" + id + ":" + value);

		return callback;
	}

	test("Garbage collection - Objects no longer referenced are let go", async () => {
		const results: string[] = [];
		let callback0: (value: string) => void = createCallback(results, 0);
		let callback1: (value: string) => void = createCallback(results, 1);
		let callback2: (value: string) => void = createCallback(results, 2);
		let second0: object = {};
		let second1: object = {};
		let second2: object = {};
		let metadata0: object = {};
		let metadata1: object = {};
		let metadata2: object = {};

		specimen.add(callback0, second0, metadata0);
		specimen.add(callback1, second1, metadata1);
		specimen.add(callback2, second2, metadata2);

		callback1 = null as unknown as (value: string) => void;
		second1 = null as unknown as object;
		metadata1 = null as unknown as object;
		
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