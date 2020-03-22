import Component from "@/component/Component";
import Nestable from "@/component/Nestable";
import { ComponentConfigImpl, ComponentConfig } from "@/component/ComponentConfig";
import ItemComponent from "@/element/repeat/ItemComponent";
import { assertNullGuarded } from "@/util/TestUtils";
import { assert, expect } from "chai";
import { describe, it, xit } from "mocha";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";

describe("ItemComponent tests", () => {

	const testParentComponent: Component = instance(mock(Component));
	const testParentId: string = "10-112-22";
	const testTemplate: string = "<div></div>";
	const testPrefix: string = "prefix";
	const testModelFn = () => { };
	const testItem = {};

	function getNewItemComponent() {
		return new ItemComponent(testTemplate, testPrefix, testParentComponent, testParentId, testModelFn, testItem);
	}

	xit("ItemComponent constructor - null template", () => {
		assertNullGuarded("dependencies", () => getNewItemComponent());
	});
});
