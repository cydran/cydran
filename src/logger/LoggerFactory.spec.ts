import LoggerFactory from "@/logger/LoggerFactory";
import { assertNullGuarded } from "@/util/TestUtils";

test("getLogger() - null name", () => {
	assertNullGuarded("name", () => LoggerFactory.getLogger(null));
});
