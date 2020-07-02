import Component from "@/component/Component";
import Repeat from "@/element/each/Repeat";
import Factories from "@/mvvm/Factories";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";

const testParentComponent: Component = instance(mock(Component));
const testParentId: string = "10-112-22";
const testTemplate: string = "<div></div>";
const testPrefix: string = "prefix";
const testModelFn = () => { /**/ };
const testItem = {};

test.skip("Repeat constructor", () => {
	//
});
