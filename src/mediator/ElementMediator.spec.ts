import { ElementMediator, ElementMediatorDependencies } from "@/Core";
import { assertNullGuarded } from "@/TestUtils";

import { assert, expect } from "chai";
import { describe, it } from "mocha";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";

class TestElementMediator extends ElementMediator<any, any> {

	protected wire(): void {
		// Intentionally do nothing
	}

	protected unwire(): void {
		// Intentionally do nothing
	}

}

describe("ElementMediator tests", () => {

	const dependencies: ElementMediatorDependencies = {
		el: null,
		expression: null,
		model: null,
		mvvm: null,
		parent: null,
		prefix: "prefix"
	};

	it("Constructor - null dependencies", () => {
		assertNullGuarded("dependencies", () => new TestElementMediator(null));
	});

	it("get() - null id", () => {
		assertNullGuarded("id", () => new TestElementMediator(dependencies).get((null)));
	});

	it("setModule() - null moduleInstance", () => {
		assertNullGuarded("moduleInstance", () => new TestElementMediator(dependencies).setModule(null));
	});

});
