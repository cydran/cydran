import { ATTRIBUTE_DELIMITER } from "Constants";
import { ValidationError } from "error/Errors";
import { extractAttributesWithPrefix, isDefined, merge, requireNotNull } from 'util/Utils';
import AttributeParser from "validator/AttributeParser";
import AttributeParserConfig from 'validator/AttributeParserConfig';
import BehaviorAttributeConverters from 'behavior/BehaviorAttributeConverters';

class AttributeParserImpl<T> implements AttributeParser<T> {

	public parse(config: AttributeParserConfig<T>, element: HTMLElement, prefix: string, validate: boolean, tagText: string): T {
		requireNotNull(config, "config");

		const extracted: any = extractAttributesWithPrefix<T>(prefix + ATTRIBUTE_DELIMITER, element);
		const valuelessDefaults: any = config.getValuelessDefaults();

		for (const key in extracted) {
			if (!extracted.hasOwnProperty(key)) {
				continue;
			}

			if ((extracted[key] as string).length === 0 && isDefined(valuelessDefaults[key])) {
				extracted[key] = valuelessDefaults[key];
			}
		}

		const merged: any = merge([config.getDefaults(), extracted]);
		const converted: T = this.convertValues(config, merged);

		if (validate) {
			this.validateValues(config, element, prefix, converted, tagText);
		}

		return converted;
	}

	private convertValues(config: AttributeParserConfig<T>, values: any): T {
		const result: T = {} as T;
		const converters: BehaviorAttributeConverters = config.getConverters();

		for (const key in values) {
			if (!values.hasOwnProperty(key)) {
				continue;
			}

			const sourceValue: any = values[key];
			const converter: (value: any) => any = converters[key];
			const resultValue: any = isDefined(converter) ? converter(sourceValue) : sourceValue;
			result[key] = resultValue;
		}

		return result;
	}

	private validateValues(config: AttributeParserConfig<T>, element: HTMLElement, prefix: string, values: T, tagText: string): void {
		const combinedPrefix: string = prefix + ATTRIBUTE_DELIMITER;
		const errors: string[] = config.getValidator().validate(values, element, combinedPrefix);

		if (errors.length > 0) {
			const message: string = `Invalid use of a ${prefix} attribute on element ${tagText}: ` + errors.join(", ");

			throw new ValidationError(message);
		}
	}

}

export default AttributeParserImpl;
