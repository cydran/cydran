import { assertNoErrorThrown, assertNullGuarded } from "@/util/TestUtils";
import { assert, expect } from "chai";
import { describe, it, xit } from "mocha";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import Component from "@/component/Component";
import { MODULE_FIELD_NAME } from "@/constant/Constants";
import Checked from "@/element/Checked";
import Factories from "@/mvvm/Factories";

describe("Factories tests", () => {

	it("Factories not null", () => {
		assert.isNotNull(Factories);
	});

	xit("register(name: string, supportedTags: string[], elementMediatorClass: Type<ElementMediator<any, HTMLElement | Text, any>>): void", () => {
		const spyFactories: Factories = spy(Factories);
		Factories.register("checked", ["input"], Checked);
		// TODO: verify(spyFactories.register("checked", ["input"], Checked)).once();
	});

	xit("get<T>(type: string): T", () => {
		const spyFactories: Factories = spy(Factories);
		Factories.register("checked", ["input"], Checked);
		// TODO: verify(spyFactories.register("checked", ["input"], Checked)).once();
	});

});
