import PairedWeakMapImpl from "pattern/PairedWeakMapImpl";
import { triggerGcAsync } from "test/TestUtils";
import { beforeEach, describe, expect, test } from '@jest/globals';

describe("PairedWeakMapImpl", () => {

	let specimen: PairedWeakMapImpl<object, object, object>;

	beforeEach(() => {
		specimen = new PairedWeakMapImpl();
	});

	test("set() - Item is added and garbage collects after being unreferenced", async () => {
		let firstKey: object = {
			key: "FirstKey"
		};

		let secondKey: object = {
			key:"SecondKey"
		};

		let value: object = {
			key: "Value"
		};

		const valueRef: WeakRef<object> = new WeakRef(value);

		specimen.set(firstKey, secondKey, value);

		expect(specimen.get(firstKey, secondKey)).toEqual(value);
		expect(valueRef.deref()).toEqual(value);

		firstKey = null as unknown as object;
		secondKey = null as unknown as object;
		value = null as unknown as object;

		await triggerGcAsync();
		await triggerGcAsync();
		await triggerGcAsync();

		expect(valueRef.deref()).toBeUndefined();
	});

	test("clear() - All items are removed", async () => {
		let firstKey: object = {
			key: "FirstKey"
		};

		let secondKey: object = {
			key:"SecondKey"
		};

		let value: object = {
			key: "Value"
		};

		const valueRef: WeakRef<object> = new WeakRef(value);

		specimen.set(firstKey, secondKey, value);

		expect(specimen.get(firstKey, secondKey)).toEqual(value);
		expect(valueRef.deref()).toEqual(value);

		specimen.clear();

		await triggerGcAsync();

		expect(specimen.get(firstKey, secondKey)).toBeUndefined();
		expect(valueRef.deref()).toEqual(value);

		value = null as unknown as object;

		await triggerGcAsync();

		expect(valueRef.deref()).toBeUndefined();
	});

});