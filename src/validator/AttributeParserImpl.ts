import BehaviorAttributeConverters from "behavior/BehaviorAttributeConverters";
import FieldValidations from "validator/FieldValidations";
import { ATTRIBUTE_DELIMITER } from "const/HardValues";
import { ValidationError } from "error/Errors";
import { extractAttributes, isDefined, merge } from 'util/Utils';
import AttributeParser from "validator/AttributeParser";
import Validator from "validator/Validator";
import ValidatorImpl from "validator/ValidatorImpl";

class AttributeParserImpl<T> implements AttributeParser<T> {

	private converters: BehaviorAttributeConverters;

	private defaults: T;

	private exclusive: boolean;

	private validator: Validator<any,HTMLElement>;

	constructor() {
		this.converters = {};
		this.defaults = {} as T;
		this.exclusive = false;
		this.validator = new ValidatorImpl<any,HTMLElement>();
	}

	public parse(element: HTMLElement, prefix: string, validate: boolean, tagText: string): T {
		const extracted: any = extractAttributes<T>(prefix + ATTRIBUTE_DELIMITER, element);
		const merged: any = merge([this.defaults, extracted]);
		const converted: T = this.convertValues(merged);

		if (validate) {
			this.validateValues(element, prefix, converted, tagText);
		}

		return converted;
	}

	public setExclusive(exclusive: boolean): void {
		this.exclusive = isDefined(exclusive) ? exclusive : false;
	}

	public getExclusive(): boolean {
		return this.exclusive;
	}

	private convertValues(values: any): T {
		const result: T = {} as T;

		for (const key in values) {
			if (!values.hasOwnProperty(key)) {
				continue;
			}

			const sourceValue: any = values[key];
			const converter: (value: any) => any = this.converters[key];
			const resultValue: any = isDefined(converter) ? converter(sourceValue) : sourceValue;
			result[key] = resultValue;
		}

		return result;
	}

	private validateValues(element: HTMLElement, prefix: string, values: T, tagText: string): void {
		const combinedPrefix: string = prefix + ATTRIBUTE_DELIMITER;
		const errors: string[] = this.validator.validate(values, element, combinedPrefix);

		if (errors.length > 0) {
			const message: string = `Invalid use of a ${prefix} attribute on element ${tagText}: ` + errors.join(", ");

			throw new ValidationError(message);
		}
	}

	public setConverters(converters: BehaviorAttributeConverters): void {
		this.converters = isDefined(converters) ? converters : {};
	}

	public setDefaults(defaults: T): void {
		this.defaults = isDefined(defaults) ? defaults : {} as T;
	}

	public setValidations(validations: FieldValidations<HTMLElement>): void {
		this.validator.setValidations(validations);
	}

}

export default AttributeParserImpl;
