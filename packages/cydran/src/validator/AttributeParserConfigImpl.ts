import BehaviorAttributeConverters from 'behavior/BehaviorAttributeConverters';
import SimpleMap from 'interface/SimpleMap';
import { isDefined } from 'util/Utils';
import AttributeParserConfig from 'validator/AttributeParserConfig';
import FieldValidations from "validator/FieldValidations";
import Validator from 'validator/Validator';
import ValidatorImpl from 'validator/ValidatorImpl';

class AttributeParserConfigImpl<T> implements AttributeParserConfig<T> {

	private converters: BehaviorAttributeConverters;

	private prefixed: boolean;

	private defaults: T;

	private valuelessDefaults: SimpleMap<string>;

	private exclusive: boolean;

	private validator: Validator<any,HTMLElement>;

	constructor() {
		this.converters = {};
		this.prefixed = true;
		this.valuelessDefaults = {};
		this.defaults = {} as T;
		this.exclusive = false;
		this.validator = new ValidatorImpl<any,HTMLElement>();
	}
	
	public setConverters(converters: BehaviorAttributeConverters): void {
		this.converters = isDefined(converters) ? converters : {};
	}

	public getConverters(): BehaviorAttributeConverters {
		return this.converters;
	}

	public setExclusive(exclusive: boolean): void {
		this.exclusive = isDefined(exclusive) ? exclusive : false;
	}

	public getExclusive(): boolean {
		return this.exclusive;
	}

	public setPrefixed(prefixed: boolean): void {
		this.prefixed = isDefined(prefixed) ? prefixed : false;
	}

	public setDefaults(defaults: T): void {
		this.defaults = isDefined(defaults) ? defaults : {} as T;
	}

	public getDefaults(): T {
		return this.defaults;
	}

	public setValuelessDefaults(valuelessDefaults: SimpleMap<string>): void {
		this.valuelessDefaults = isDefined(valuelessDefaults) ? valuelessDefaults : {} as SimpleMap<string>;
	}

	public getValuelessDefaults(): SimpleMap<string> {
		return this.valuelessDefaults;
	}

	public setValidations(validations: FieldValidations<HTMLElement>): void {
		this.validator.setValidations(validations);
	}

	public getValidator(): Validator<any,HTMLElement> {
		return this.validator;
	}

}

export default AttributeParserConfigImpl;