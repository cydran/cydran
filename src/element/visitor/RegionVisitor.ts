import { isDefined, requireValid, elementAsString } from "util/Utils";
import Nestable from "interface/ables/Nestable";
import ElementVisitor from "element/visitor/ElementVisitor";
import AttributeExtractor from "component/AttributeExtractor";
import Attrs from "const/AttrsFields";
import Validator from "validator/Validator";
import Validators from "validator/Validators";
import ValidatorImpl from "validator/ValidatorImpl";
import { VALID_KEY, VALID_ID } from "Constants";
import Module from "module/Module";
import { UnknownComponentError } from "error/Errors";
import RegionImpl from "component/RegionImpl";

class RegionVisitor implements ElementVisitor<HTMLScriptElement, any> {

	public visit(element: HTMLScriptElement, context: any, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		const extractor: AttributeExtractor = context.getExtractor();
		const name: string = extractor.extract(element, Attrs.NAME);

		if (isDefined(name)) {
			requireValid(name, extractor.asTypePrefix(Attrs.NAME), VALID_KEY);
		}

		const validator: Validator = new ValidatorImpl();
		const check: (name: string, value?: any) => Validators = validator.getFunction();
		check(extractor.asTypePrefix(Attrs.NAME), extractor.extract(element, Attrs.NAME)).matches(VALID_KEY);
		check(extractor.asTypePrefix(Attrs.COMPONENT), extractor.extract(element, Attrs.COMPONENT)).matches(VALID_ID);
		check(extractor.asTypePrefix(Attrs.COMPONENT), extractor.extract(element, Attrs.MODULE)).matches(VALID_ID);

		validator.throwIfErrors(() => `Invalid use of cydran/region on element ${elementAsString(element)}`);

		const componentName: string = extractor.extract(element, Attrs.COMPONENT);
		const moduleName: string = extractor.extract(element, Attrs.MODULE);
		const regionName: string = isDefined(name) ? name : context.createRegionName();
		const valueExpression: string = extractor.extract(element, Attrs.VALUE);
		const lockedAttr: string = extractor.extract(element, Attrs.LOCK);
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
					throw new UnknownComponentError(`Unknown component ${ componentName } referenced in component ${ componentClassName }`);
				}

				return component;
			});
		}
	}
}

export default RegionVisitor;
