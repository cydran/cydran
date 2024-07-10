import { describe, test, expect } from '@jest/globals';
import PropertyGeneralizationPredicate from 'properties/PropertyGeneralizationPredicate';

describe("PropertyGeneralizationPredicate", () => {

	test("placeholder", () => {
		const predicate: PropertyGeneralizationPredicate = new PropertyGeneralizationPredicate("foo.bar.baz.level", null, (key: string) => true);
		expect(predicate).not.toBeNull();
	});

	// Property missing
	// Property at full length of property name
	// Property without prefix
	// Property with prefix


});
