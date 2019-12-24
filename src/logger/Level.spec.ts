import Level from "@/logger/Level";
import LevelUtils from "@/logger/LevelUtils";
import { assert } from "chai";
import { describe, it, xit } from "mocha";

describe("Level tests", () => {
	const enumStates: String[] = ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL", "DISABLED"];

	it(".getKeys(): Array<string>", () => {
		const objKeys: String[] = LevelUtils.getKeys();
		assert.sameMembers(enumStates, objKeys, "key set having the same member values");
	});

	it(".size(): number", () => {
		assert.isTrue(enumStates.length === LevelUtils.size(), "the the correct length");
	});

	it(".values(): Array<Level>", () => {
		assert.equal(LevelUtils.values().length, enumStates.length, "with the correct number of values");
	});

	it(".stringValueOf(l:Level): string", () => {
		LevelUtils.values().forEach((v) => {
			assert.include(enumStates, LevelUtils.stringValueOf(v), "array contains value");
		});
	});

	it(".valueOf(lvl:string): Level", () => {
		const tstkey = "bubba";
		assert.isUndefined(LevelUtils.valueOf(tstkey), "is 'undefined' and nothing is created.");
	});

});
