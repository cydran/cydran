import Component from "@/component/Component";
import ItemComponent from "@/element/each/ItemComponent";
import { assertNullGuarded } from "@/util/TestUtils";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import ModulesContextImpl from "@/module/ModulesContextImpl";

const testParentComponent: Component = instance(mock(Component));
const testParentId: string = "10-112-22";
const testTemplate: string = "<div></div>";
const testPrefix: string = "prefix";
const testModelFn = () => { /**/ };
const testItem = {};

function getNewItemComponent() {
	return new ItemComponent(new ModulesContextImpl().getDefaultModule(), testTemplate, testPrefix, testParentComponent,
		testParentId, testModelFn, () => testItem);
}

test("ItemComponent constructor", () => {
	const itemComponent: ItemComponent = getNewItemComponent();
	expect(itemComponent).not.toBeNull();
});
