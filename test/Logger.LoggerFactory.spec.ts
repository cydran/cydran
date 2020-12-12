import { LoggerFactory } from "log/LoggerImpl";
import { assertNullGuarded } from "./TestUtils";

test("getLogger() - null name", () => {
	assertNullGuarded("name", () => LoggerFactory.getLogger(null));
});
