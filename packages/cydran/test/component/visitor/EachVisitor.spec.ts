/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import EachVisitor from "component/visitor/EachVisitor";
import ComponentInternals from "component/ComponentInternals";
import EachElementBehavior from "behavior/core/EachElementBehavior";
import EachElement from "element/EachElement";
import GlobalContextImpl from "context/GlobalContextImpl";
import { TemplateError } from "error/Errors";
import { beforeAll, describe, expect, jest, test } from "@jest/globals";

interface Fixture {

	internals: ComponentInternals;

	addBehavior: jest.Mock;

}

function createInternals(): Fixture {
	const addBehavior: jest.Mock = jest.fn();
	const internals: ComponentInternals = {
		addBehavior: addBehavior,
		getModel: () => ({}),
		isValidated: () => false,
		getExtractor: () => ({ getPrefix: () => "c", asTypePrefix: (type: string) => `c-${type}` })
	} as unknown as ComponentInternals;

	return { internals: internals, addBehavior: addBehavior };
}

function createParent(eachAttributes: string): HTMLElement {
	const parent: HTMLElement = document.createElement("ul");
	parent.innerHTML = `<c-each ${eachAttributes}><template c-type="item"><li></li></template></c-each>`;

	return parent;
}

function visit(parent: HTMLElement, fixture: Fixture, topLevel: boolean = false): jest.Mock {
	const consumer: jest.Mock = jest.fn();
	new EachVisitor().visit(parent.querySelector("c-each") as EachElement, fixture.internals, consumer, topLevel);

	return consumer;
}

describe("EachVisitor", () => {
	beforeAll(() => {
		new GlobalContextImpl();
	});

	test("adds an initialized each element behavior and replaces the element with markers", () => {
		const fixture: Fixture = createInternals();
		const parent: HTMLElement = createParent('items="m().items"');

		visit(parent, fixture);

		expect(fixture.addBehavior).toHaveBeenCalledTimes(1);
		expect(fixture.addBehavior.mock.calls[0][0]).toBeInstanceOf(EachElementBehavior);
		expect(parent.querySelector("c-each")).toBeNull();
		expect(parent.childNodes.length).toEqual(2);
	});

	test("doesn't hand the children to the walker", () => {
		const fixture: Fixture = createInternals();

		const consumer: jest.Mock = visit(createParent('items="m().items"'), fixture);

		expect(consumer).not.toHaveBeenCalled();
	});

	test("[[ ]] items is accepted", () => {
		const fixture: Fixture = createInternals();

		visit(createParent('items="[[m().items]]"'), fixture);

		expect(fixture.addBehavior).toHaveBeenCalledTimes(1);
	});

	test("missing items", () => {
		const fixture: Fixture = createInternals();

		expect(() => visit(createParent('mode="none"'), fixture)).toThrow(TemplateError);
		expect(() => visit(createParent('mode="none"'), fixture)).toThrow(/items/);
		expect(fixture.addBehavior).not.toHaveBeenCalled();
	});

	test("empty items", () => {
		const fixture: Fixture = createInternals();

		expect(() => visit(createParent('items="  "'), fixture)).toThrow(/items/);
	});

	test("top level", () => {
		const fixture: Fixture = createInternals();

		expect(() => visit(createParent('items="m().items"'), fixture, true)).toThrow(/top-level/);
		expect(fixture.addBehavior).not.toHaveBeenCalled();
	});
});
