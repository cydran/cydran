import { assert, expect } from "chai";
import { describe, it, xit } from "mocha";
import ConsoleOutputStrategy from "../src/logger/ConsoleOutputStrategy";
import Level from "../src/logger/Level";
import LevelUtils from "../src/logger/LevelUtils";
import OutputStrategy from "../src/logger/OutputStrategy";

describe("ConsoleOutputStrategy tests", () => {

	const msg: string = "test payload";
	const cos: ConsoleOutputStrategy = new ConsoleOutputStrategy();

	it("ConsoleOutputStrategy is not null", () => {
		expect(cos).to.not.be.null;
	});

	it("ConsoleOutputStrategy log()", () => {
		LevelUtils.values().forEach((l: Level) => {
			cos.log("ConsoleOutputStrategySpec", l, msg + " *** " + LevelUtils.stringValueOf(l));
		});
	});

});
