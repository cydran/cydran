import LoggerFactory from "log/LoggerFactory";
import { assertNullGuarded } from "test/TestUtils";

test("getLogger() - null name", () => {
	assertNullGuarded("name", () => LoggerFactory.getLogger(null));
});
