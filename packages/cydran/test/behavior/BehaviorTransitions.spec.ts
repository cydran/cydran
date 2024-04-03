import BehaviorTransitions from "behavior/BehaviorTransitions";
import { isDefined } from "util/Utils";

const enumKeys: string[] = "init,mount,unmount".split(",");

test("all accounted for", () => {
	for(const key of enumKeys) {
		const behavTrans: BehaviorTransitions = BehaviorTransitions[key.toUpperCase()];
		expect(behavTrans).toEqual(key);
	}
});

test("associated values are correct", () => {
	for(const key of enumKeys) {
		switch(key) {
			case BehaviorTransitions.INIT:
			case BehaviorTransitions.MOUNT:
			case BehaviorTransitions.UNMOUNT:
				expect(isDefined(BehaviorTransitions[key.toUpperCase()])).toBe(true);
				break;
			default:
				fail("invalid value");
		}
	}
});
