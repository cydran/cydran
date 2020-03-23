import Component from "@/component/Component";
import UtilityComponent from "@/element/repeat/UtilityComponent";
import { assert, expect } from "chai";
import { describe, it, xit } from "mocha";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";

describe("UtilityComponent tests", () => {

	const testParentComponent: Component = instance(mock(Component));
	const testParentId: string = "10-112-22";
	const testTemplate: string = "<div></div>";
	const testPrefix: string = "prefix";
	const testModelFn = () => { /**/ };
	const testItem = {};

	function getNewUtilityComponent() {
		return new UtilityComponent(testTemplate, testPrefix, testParentComponent, testParentId, testModelFn);
	}

	it("UtilityComponent constructor", () => {
		const utilComponent: UtilityComponent = getNewUtilityComponent();
		assert.isNotNull(utilComponent);
	});
});
