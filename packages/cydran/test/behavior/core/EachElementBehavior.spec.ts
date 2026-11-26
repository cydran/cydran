/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import BehaviorDependencies from "behavior/BehaviorDependencies";
import BehaviorTransitions from "behavior/BehaviorTransitions";
import EachAttributes from "behavior/core/each/EachAttributes";
import EachElementBehavior from "behavior/core/EachElementBehavior";
import GlobalContextImpl from "context/GlobalContextImpl";
import { beforeAll, describe, expect, test } from "@jest/globals";

class ProbeBehavior extends EachElementBehavior {

	public params(): EachAttributes {
		return this.getParams();
	}

}

function createParent(eachAttributes: string): HTMLElement {
	const parent: HTMLElement = document.createElement("ul");
	parent.innerHTML = `<li>before</li><c-each ${eachAttributes}><template c-type="item"><li></li></template></c-each><li>after</li>`;

	return parent;
}

function initialize(parent: HTMLElement): ProbeBehavior {
	const dependencies: BehaviorDependencies = {
		el: parent.querySelector("c-each") as HTMLElement,
		expression: "m().items",
		model: {},
		parent: null,
		prefix: "c",
		behaviorPrefix: "c-each",
		validated: false,
		mutable: true
	};

	const specimen: ProbeBehavior = new ProbeBehavior();
	specimen.tell(BehaviorTransitions.INIT, dependencies);

	return specimen;
}

describe("EachElementBehavior", () => {
	beforeAll(() => {
		new GlobalContextImpl();
	});

	test("settings are read without a prefix", () => {
		const specimen: ProbeBehavior = initialize(createParent('mode="expression" idkey="key" expression="v().sku"'));

		expect(specimen.params()).toEqual({ mode: "expression", idkey: "key", expression: "v().sku" });
	});

	test("prefixed settings are ignored", () => {
		const specimen: ProbeBehavior = initialize(
			createParent('c-each-mode="none" c-each-idkey="key" c-each-expression="v().sku"')
		);

		expect(specimen.params().mode).toEqual("generated");
		expect(specimen.params().idkey).toEqual("id");
		expect(specimen.params().expression).toBeFalsy();
	});

	test("the element is replaced by two markers in its place", () => {
		const parent: HTMLElement = createParent('mode="none"');

		initialize(parent);

		const nodes: string[] = Array.from(parent.childNodes).map((node: Node) =>
			node.nodeType === Node.COMMENT_NODE ? `<!--${node.textContent}-->` : (node as HTMLElement).outerHTML);

		expect(parent.querySelector("c-each")).toBeNull();
		expect(nodes).toEqual(["<li>before</li>", "<!--ES-->", "<!--EE-->", "<li>after</li>"]);
	});
});
