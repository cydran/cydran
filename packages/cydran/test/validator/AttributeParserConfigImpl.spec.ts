import AttributeParserConfig from "validator/AttributeParserConfig";
import AttributeParserConfigImpl from "validator/AttributeParserConfigImpl";
import { validateDefined, validateOneOf } from 'validator/Validations';
import { describe, beforeAll, beforeEach, test, expect } from '@jest/globals';

interface TestTemplateAttributes {
	key: string;
	component: string;
	value: string;
}

const testPrefix: string = "t";
const specimen: AttributeParserConfig<TestTemplateAttributes> = new AttributeParserConfigImpl<TestTemplateAttributes>();

describe("AttributeParserConfigImpl", () => {

	beforeAll(() => {
		specimen.setDefaults({
			key: null,
			component: null,
			value: null
		});
	});

	beforeEach(() => {
		// todo: set things up here
	});

	test("setExclusive", () => {
		specimen.setValidations({
			key: [validateDefined, validateOneOf("one", "two", "three")],
			value: [validateDefined]
		});

		expect(specimen.getExclusive()).toBe(false);
		specimen.setExclusive(true);
		expect(specimen.getExclusive()).toBe(true);
	});

});
