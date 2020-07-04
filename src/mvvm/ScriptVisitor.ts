import UnknownComponentError from "@/error/UnknownComponentError";
import { isDefined, requireValid } from "@/util/ObjectUtils";
import Nestable from "@/component/Nestable";
import Module from "@/module/Module";
import RegionImpl from "@/component/RegionImpl";
import { VALID_KEY } from "@/constant/ValidationRegExp";
import Mvvm from "@/mvvm/Mvvm";
import ElementVisitor from "@/dom/ElementVisitor";
import AttributeExtractor from "@/mvvm/AttributeExtractor";

class ScriptVisitor implements ElementVisitor<HTMLScriptElement, any> {

	public visit(element: HTMLScriptElement, context: Mvvm, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		if (element.type !== "cydran/region") {
			return;
		}

		const extractor: AttributeExtractor = context.getExtractor();

		const name: string = extractor.extract(element, "name");

		if (isDefined(name)) {
			requireValid(name, "name", VALID_KEY);
		}

		const componentName: string = extractor.extract(element, "component");
		const moduleName: string = extractor.extract(element, "module");
		const regionName: string = isDefined(name) ? name : context.createRegionName();
		const valueExpression: string = extractor.extract(element, "value");
		const lockedAttr: string = extractor.extract(element, "lock");
		const explicitlyLocked: boolean = isDefined(lockedAttr) && lockedAttr.toLowerCase() === "true";
		const implicitlyLocked: boolean = isDefined(componentName) && componentName !== "" && !isDefined(name);
		const locked: boolean = explicitlyLocked || implicitlyLocked;
		const region: RegionImpl = context.addRegion(regionName, element, locked) as RegionImpl;

		region.setExpression(valueExpression);

		if (isDefined(componentName) && componentName !== "") {
			region.setInitialComponentFn(() => {
				const moduleToUse: Module = isDefined(moduleName) ? context.getModule().getModule(moduleName) : context.getModule();
				const component: Nestable = isDefined(moduleToUse) ? moduleToUse.get(componentName) : context.getModule().get(componentName);

				if (!isDefined(component)) {
					const componentClassName: string = context.getParent().getComponent().constructor.name;
					throw new UnknownComponentError("Unknown component " + componentName + " referenced in component " + componentClassName);
				}

				return component;
			});
		}
	}

}

export default ScriptVisitor;
