import { ATTRIBUTE_DELIMITER } from "CydranConstants";
import { ValidationError } from "error/Errors";
import { extractAttributesWithPrefix, extractAttributes, isDefined, merge, requireNotNull } from 'util/Utils';
import AttributeParser from "validator/AttributeParser";
import AttributeParserConfig from 'validator/AttributeParserConfig';
import BehaviorAttributeConverters from 'behavior/BehaviorAttributeConverters';
import SimpleMap from 'interface/SimpleMap';

class AttributeParserImpl<T> implements AttributeParser<T> {

	public parse(config: AttributeParserConfig<T>, element: HTMLElement, prefix: string, validate: boolean, tagText: string): T {
		requireNotNull(config, "config");

		const extracted: SimpleMap<string> = config.isPrefixed()
			? extractAttributesWithPrefix(prefix + ATTRIBUTE_DELIMITER, element, config.getValidator().getNames())
			: extractAttributes(element, config.getValidator().getNames());

		const valuelessDefaults: SimpleMap<string> = config.getValuelessDefaults();

		for (const key of Object.keys(extracted)) {
			if (isDefined(extracted[key]) && (extracted[key] as string).length === 0 && isDefined(valuelessDefaults[key])) {
				extracted[key] = valuelessDefaults[key];
			}
		}

		const merged: SimpleMap<string> = merge([config.getDefaults(), extracted]);
		const converted: T = this.convertValues(config, merged);

		if (validate) {
			this.validateValues(config, element, prefix, converted, tagText);
		}

		return converted;
	}

	private convertValues(config: AttributeParserConfig<T>, values: SimpleMap<string>): T {
		const result: T = {} as T;
		const converters: BehaviorAttributeConverters = config.getConverters();

		for (const key of Object.keys(values)) {
			const sourceValue: string = values[key];
			const converter: (value: string) => unknown = converters[key];
			const resultValue: unknown = isDefined(converter) ? converter(sourceValue) : sourceValue;
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
