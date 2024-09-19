import AttributeParserConfig from 'validator/AttributeParserConfig';

interface AttributeParser<T> {

	parse(config: AttributeParserConfig<T>, element: HTMLElement, prefix: string, validate: boolean, tagText: string): T;

}

export default AttributeParser;
