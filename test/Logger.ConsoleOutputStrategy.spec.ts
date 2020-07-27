import { ConsoleOutputStrategy, Level, LevelUtils } from "@/Logger";

const msg: string = "test payload";
const cos: ConsoleOutputStrategy = new ConsoleOutputStrategy();

it("ConsoleOutputStrategy is not null", () => {
	expect(cos).not.toBeNull();
});

it("ConsoleOutputStrategy log()", () => {
	LevelUtils.values().forEach((l: Level) => {
		cos.log("ConsoleOutputStrategySpec", l, msg + " *** " + LevelUtils.stringValueOf(l));
	});
});
