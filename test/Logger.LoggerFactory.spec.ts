import { LoggerFactory } from "Logger";
import { assertNullGuarded } from "TestUtils";

test("getLogger() - null name", () => {
	assertNullGuarded("name", () => LoggerFactory.getLogger(null));
});
