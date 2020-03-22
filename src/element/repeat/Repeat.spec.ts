import Component from "@/component/Component";
import Repeat from "@/element/repeat/Repeat";
import Factories from "@/mvvm/Factories";
import { assert, expect } from "chai";
import { describe, it, xit } from "mocha";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";

describe("Repeat tests", () => {

	const testParentComponent: Component = instance(mock(Component));
	const testParentId: string = "10-112-22";
	const testTemplate: string = "<div></div>";
	const testPrefix: string = "prefix";
	const testModelFn = () => { };
	const testItem = {};

	xit("Repeat constructor", () => {
		//
	});
});
