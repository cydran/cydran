import { spy } from "ts-mockito";
import AttributeParser from "validator/AttributeParser";
import AttributeParserImpl from "validator/AttributeParserImpl";
import { validateDefined, validateOneOf } from 'validator/Validations';

interface TestTemplateAttributes {
	key: string;
	component: string;
	value: string;
}

const testPrefix: string = "t";
const ATTRIBUTE_PARSER: AttributeParser<TestTemplateAttributes> = new AttributeParserImpl<TestTemplateAttributes>();

beforeAll(() => {
	ATTRIBUTE_PARSER.setDefaults({
		key: null,
		component: null,
		value: null
	});
});

beforeEach(() => {
	// todo: set things up here
});

test("setExclusive", () => {
	ATTRIBUTE_PARSER.setValidations({
		key: [ validateDefined, validateOneOf("one", "two", "three") ],
		value: [ validateDefined ]
	});
	expect(ATTRIBUTE_PARSER.getExclusive()).toBe(false);
	ATTRIBUTE_PARSER.setExclusive(true);
	expect(ATTRIBUTE_PARSER.getExclusive()).toBe(true);
});
