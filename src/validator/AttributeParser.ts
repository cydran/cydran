import BehaviorAttributeConverters from "behavior/BehaviorAttributeConverters";
import BehaviorAttributeValidations from "behavior/BehaviorAttributeValidations";

interface AttributeParser<T> {

	parse(element: HTMLElement, prefix: string, validate: boolean, tagText: string): T;

	setDefaults(defaults: T): void;

	setValidations(validations: BehaviorAttributeValidations<HTMLElement>): void;

	setConverters(converters: BehaviorAttributeConverters): void;

}

export default AttributeParser;
