import {describe, it} from "mocha";
import {assert} from "chai";
import SequenceGenerator from "./SequenceGenerator";

describe('SequenceGenerator tests', () => {

	it('ascending numbers should be supplied', () => {
		let value0: number = SequenceGenerator.INSTANCE.next();
		let value1: number = SequenceGenerator.INSTANCE.next();
		let value2: number = SequenceGenerator.INSTANCE.next();
		let value3: number = SequenceGenerator.INSTANCE.next();
		let value4: number = SequenceGenerator.INSTANCE.next();

		assert.isTrue(value0 < value1);
		assert.isTrue(value1 < value2);
		assert.isTrue(value2 < value3);
		assert.isTrue(value3 < value4);
	});

});