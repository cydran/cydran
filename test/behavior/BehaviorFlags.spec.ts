import BehaviorFlags from "behavior/BehaviorFlags";
import { isDefined } from "util/Utils";

const enumKeys: string[] = "ROOT_PROHIBITED,PROPAGATION,CHILD_CONSUMPTION_PROHIBITED".split(",");

test("all accounted for", () => {
	for(const key of enumKeys) {
		const behavTrans: BehaviorFlags = BehaviorFlags[key.toUpperCase()];
		expect(behavTrans).toEqual(key);
	}
});

test("associated values are correct", () => {
	for(const key of enumKeys) {
		switch(key) {
			case BehaviorFlags.ROOT_PROHIBITED:
			case BehaviorFlags.PROPAGATION:
			case BehaviorFlags.CHILD_CONSUMPTION_PROHIBITED:
				expect(isDefined(BehaviorFlags[key.toUpperCase()])).toBe(true);
				break;
			default:
				fail("invalid value");
		}
	}
});
