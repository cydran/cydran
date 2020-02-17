import ConsoleOutputStrategy from "@/logger/ConsoleOutputStrategy";
import Level from "@/logger/Level";
import LevelUtils from "@/logger/LevelUtils";
import { expect } from "chai";
import { describe, it, xit } from "mocha";

describe("ConsoleOutputStrategy tests", () => {

	const msg: string = "test payload";
	const cos: ConsoleOutputStrategy = new ConsoleOutputStrategy();

	it("ConsoleOutputStrategy is not null", () => {
		expect(cos).to.not.equal(null);
	});

	it("ConsoleOutputStrategy log()", () => {
		LevelUtils.values().forEach((l: Level) => {
			cos.log("ConsoleOutputStrategySpec", l, msg + " *** " + LevelUtils.stringValueOf(l));
		});
	});

});
