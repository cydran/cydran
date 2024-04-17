import { Component, MutableProperties } from '@cydran/cydran';
import { beforeEach, expect, test } from '@jest/globals';
import { Harness } from '@cydran/testsupport';

let properties0: MutableProperties = null as unknown as MutableProperties;
let properties1: MutableProperties = null as unknown as MutableProperties;
let properties2: MutableProperties = null as unknown as MutableProperties;

const harness: Harness<Component> = new Harness<Component>();

beforeEach(() => {
	harness.reset();
	harness.start();

	properties0 = harness.getContext().getProperties();
	properties1 = properties0["extend"]();
	properties2 = properties1["extend"]();
});

test("Context Messaging - Global broadcast", () => {
	properties0.set("foo", "Alpha");
	properties1.set("foo", "Beta");
	properties2.set("foo", "Gamma");
	expect(properties0.get("foo")).toEqual("Alpha");
	expect(properties1.get("foo")).toEqual("Beta");
	expect(properties2.get("foo")).toEqual("Gamma");
});
