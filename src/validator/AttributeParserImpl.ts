import BehaviorAttributeConverters from "behavior/BehaviorAttributeConverters";
import BehaviorAttributeValidations from "behavior/BehaviorAttributeValidations";
import { ATTRIBUTE_DELIMITER } from "const/HardValues";
import { ValidationError } from "error/Errors";
import { extractAttributes, isDefined, merge, requireNotNull } from 'util/Utils';
import AttributeParser from "validator/AttributeParser";

class AttributeParserImpl<T> implements AttributeParser<T> {

	private converters: BehaviorAttributeConverters;

	private defaults: T;

	private validations: BehaviorAttributeValidations<HTMLElement>;

	private exclusive: boolean;

	constructor() {
		this.converters = {};
		this.defaults = {} as T;
		this.validations = {};
		this.exclusive = false;
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
		const errors: string[] = [];

		for (const key in this.validations) {
			if (!this.validations.hasOwnProperty(key)) {
				continue;
			}

			const value: any = values[key];
			const validations: ((field: any, instance: any, context: HTMLElement) => string)[] = this.validations[key];
			this.validateValue(prefix, key, value, values, element, validations, errors);
		}

		if (errors.length > 0) {
			const message: string = `Invalid use of a ${prefix} attribute on element ${tagText}: ` + errors.join(", ");

			throw new ValidationError(message);
		}
	}

	private validateValue(
		prefix: string,
		key: string,
		value: any,
		instance: any,
		context: HTMLElement,
		validations: ((value: any, instance: any, context: HTMLElement) => string)[], errors: string[]
	): void {
		for (const validation of validations) {
			const message: string = validation(value, instance, context);

			if (isDefined(message)) {
				const error: string = `${prefix}${ATTRIBUTE_DELIMITER}${key} ${message}`;
				errors.push(error);
			}
		}
	}

	public setConverters(converters: BehaviorAttributeConverters): void {
		this.converters = isDefined(converters) ? converters : {};
	}

	public setDefaults(defaults: T): void {
		this.defaults = isDefined(defaults) ? defaults : {} as T;
	}

	public setValidations(validations: BehaviorAttributeValidations<HTMLElement>): void {
		this.validations = isDefined(validations) ? validations : {};
	}

}

export default AttributeParserImpl;
