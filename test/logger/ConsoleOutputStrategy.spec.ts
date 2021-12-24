import Level from 'log/Level';
import ConsoleOutputStrategy from 'log/ConsoleOutputStrategy';
import LevelUtils from 'log/LevelUtils';

const msg: string = "test payload";
const cos: ConsoleOutputStrategy = new ConsoleOutputStrategy();

test("ConsoleOutputStrategy is not null", () => {
	expect(cos).not.toBeNull();
});

test("ConsoleOutputStrategy log()", () => {
	LevelUtils.values().forEach((l: Level) => {
		cos.log("ConsoleOutputStrategySpec", l, msg + " *** " + LevelUtils.stringValueOf(l));
	});
});
