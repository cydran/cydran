import {assert} from "chai";
import {describe, it, xit} from "mocha";
import Level from "./Level";

const enumStates: Array<string> = ['TRACE', 'DEBUG', 'INFO', 'ERROR', 'FATAL', 'DISABLE'];
describe("Level tests", () => {

	it(".getKeys(): Array<string>", () => {
		let objKeys: Array<string> = Level.getKeys();
		assert.sameMembers(enumStates, objKeys, "key set having the same member values");
	});

	it(".size(): number", () => {
		assert.isTrue(enumStates.length === Level.size(), "the the correct length");
	});

	it(".values(): Array<Level>", () => {
		assert.equal(Level.values().length, enumStates.length, "with the correct number of values");
	});

	it(".stringValueOf(l:Level): string", () => {
		Level.values().forEach(v => {
			assert.include(enumStates, Level.stringValueOf(v), "array contains value");
		});
	});

	it(".valueOf(lvl:string): Level", () => {
		let tstkey = 'bubba';
		assert.isUndefined(Level.valueOf(tstkey), 'is \'undefined\' and nothing is created.');
	});

});
