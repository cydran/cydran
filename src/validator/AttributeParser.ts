import BehaviorAttributeConverters from "behavior/BehaviorAttributeConverters";
import FieldValidations from "validator/FieldValidations";

interface AttributeParser<T> {

	parse(element: HTMLElement, prefix: string, validate: boolean, tagText: string): T;

	setDefaults(defaults: T): void;

	setValidations(validations: FieldValidations<HTMLElement>): void;

	setConverters(converters: BehaviorAttributeConverters): void;

	setExclusive(exclusive: boolean): void;

	getExclusive(): boolean;

}

export default AttributeParser;
