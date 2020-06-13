import Component from "@/component/Component";
import UtilityComponent from "@/element/repeat/UtilityComponent";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import ModulesContextImpl from "@/module/ModulesContextImpl";

const testParentComponent: Component = instance(mock(Component));
const testParentId: string = "10-112-22";
const testTemplate: string = "<div></div>";
const testPrefix: string = "prefix";
const testModelFn = () => { /**/ };

function getNewUtilityComponent() {
	return new UtilityComponent(new ModulesContextImpl().getDefaultModule(), testTemplate, testPrefix, testParentComponent,
		testParentId, testModelFn);
}

test("UtilityComponent constructor", () => {
	const utilComponent: UtilityComponent = getNewUtilityComponent();
	expect(utilComponent).not.toBeNull();
});
