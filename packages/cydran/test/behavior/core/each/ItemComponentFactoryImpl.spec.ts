import ItemComponentFactoryImpl from "behavior/core/each/ItemComponentFactoryImpl";
import { Context } from 'context/Context';
import GlobalContextImpl from 'context/GlobalContextImpl';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

const template: string = "<div></div>";
const prefix: string = "x";

function context(): Context {
	return new GlobalContextImpl().createChild();
}

describe("ItemComponentFactoryImpl", () => {

	let instance: ItemComponentFactoryImpl = null;

	beforeEach(() => {
		const wkMod: Context = context();
		instance = new ItemComponentFactoryImpl(wkMod, template, prefix, null, null, null);
	});

	afterEach(() => {
		instance = null;
	});

	test("Instance is good and ready", () => {
		expect(instance).not.toBeNull();
	});

});
