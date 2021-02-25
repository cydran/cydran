import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import * as testCydran from 'cydran';

test("Cydran should be defined and populated", () => {
	expect(testCydran).not.toBeNull();
	expect(testCydran["Component"]).toBeDefined();
});
