import ElementVisitor from '@/dom/ElementVisitor';
import AttributeExtractor from "@/mvvm/AttributeExtractor";
import { NAME_ATTRIBUTE, COMPONENT_ATTRIBUTE, MODULE_ATTRIBUTE, VALUE_ATTRIBUTE, LOCK_ATTRIBUTE } from '@/constant/AttributeNames';
import { isDefined, requireValid } from "@/util/ObjectUtils";
import Validator from "@/validation/Validator";
import ValidatorImpl from '@/validation/ValidatorImpl';
import { VALID_KEY, VALID_ID } from '@/constant/ValidationRegExp';
import { elementAsString } from "@/util/DomUtils";
import RegionImpl from '@/component/RegionImpl';
import Module from '@/module/Module';
import Nestable from '@/component/Nestable';
import UnknownComponentError from '@/error/UnknownComponentError';
import Validators from '@/validation/Validators';

class RegionVisitor implements ElementVisitor<HTMLScriptElement, any> {

	public visit(element: HTMLScriptElement, context: any, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		const extractor: AttributeExtractor = context.getExtractor();
		const name: string = extractor.extract(element, NAME_ATTRIBUTE);

		if (isDefined(name)) {
			requireValid(name, extractor.asTypePrefix(NAME_ATTRIBUTE), VALID_KEY);
		}

		const validator: Validator = new ValidatorImpl();
		const check: (name: string, value?: any) => Validators = validator.getFunction();
		check(extractor.asTypePrefix(NAME_ATTRIBUTE), extractor.extract(element, NAME_ATTRIBUTE)).matches(VALID_KEY);
		check(extractor.asTypePrefix(COMPONENT_ATTRIBUTE), extractor.extract(element, COMPONENT_ATTRIBUTE)).matches(VALID_ID);
		check(extractor.asTypePrefix(COMPONENT_ATTRIBUTE), extractor.extract(element, MODULE_ATTRIBUTE)).matches(VALID_ID);

		validator.throwIfErrors(() => "Invalid use of cydran/region on element " + elementAsString(element));

		const componentName: string = extractor.extract(element, COMPONENT_ATTRIBUTE);
		const moduleName: string = extractor.extract(element, MODULE_ATTRIBUTE);
		const regionName: string = isDefined(name) ? name : context.createRegionName();
		const valueExpression: string = extractor.extract(element, VALUE_ATTRIBUTE);
		const lockedAttr: string = extractor.extract(element, LOCK_ATTRIBUTE);
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

export default RegionVisitor;