import LoggerFactory from "log/LoggerFactory";
import { assertNullGuarded } from "TestUtils";

test("getLogger() - null name", () => {
	assertNullGuarded("name", () => LoggerFactory.getLogger(null));
});
