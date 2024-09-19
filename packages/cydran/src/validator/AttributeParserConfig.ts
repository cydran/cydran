import BehaviorAttributeConverters from "behavior/BehaviorAttributeConverters";
import SimpleMap from "interface/SimpleMap";
import FieldValidations from "validator/FieldValidations";
import Validator from 'validator/Validator';

interface AttributeParserConfig<T> {

	setDefaults(defaults: T): void;

	getDefaults(): T;

	setValuelessDefaults(valuelessDefaults: SimpleMap<string>): void;

	getValuelessDefaults(): SimpleMap<string>;

	setValidations(validations: FieldValidations<HTMLElement>): void;

	setConverters(converters: BehaviorAttributeConverters): void;

	getConverters(): BehaviorAttributeConverters;

	setPrefixed(prefixed: boolean): void;

	isPrefixed(): boolean;

	setExclusive(exclusive: boolean): void;

	getExclusive(): boolean;

	getValidator(): Validator<any,HTMLElement>;

}

export default AttributeParserConfig;
