import { Component, Properties } from '@cydran/cydran';
import { beforeEach, expect, test } from '@jest/globals';
import { Harness } from '@cydran/testsupport';

const harness: Harness<Component> = new Harness<Component>();
let properties0: Properties = harness.getContext().getProperties();
let properties1: Properties = properties0["extend"]();
let properties2: Properties = properties1["extend"]();

beforeEach(() => {
	harness.reset();
	harness.start();
});

test("Context Messaging - Global broadcast", () => {
	properties0.set("foo", "Alpha");
	properties1.set("foo", "Beta");
	properties2.set("foo", "Gamma");
	expect(properties0.get("foo")).toEqual("Alpha");
	expect(properties1.get("foo")).toEqual("Beta");
	expect(properties2.get("foo")).toEqual("Gamma");
});
