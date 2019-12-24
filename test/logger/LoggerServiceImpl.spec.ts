import Level from "@/logger/Level";
import LoggerService from "@/logger/LoggerService";
import LoggerServiceImpl from "@/logger/LoggerServiceImpl";
import { assert } from "chai";
import { describe, it, xit } from "mocha";

describe("LogggerServiceImpl tests", () => {
	const ls: LoggerServiceImpl = LoggerServiceImpl.INSTANCE;

	it("LoggerService setLevel - TRACE", () => {
		ls.setLevel(Level.TRACE);
		assert.isTrue(ls.isTrace());
	});

	it("LoggerService setLevel - DEBUG", () => {
		ls.setLevel(Level.DEBUG);
		assert.isTrue(ls.isDebug());
	});

	it("LoggerService setLevel - INFO", () => {
		ls.setLevel(Level.INFO);
		assert.isTrue(ls.isInfo());
	});

	it("LoggerService setLevel - WARN", () => {
		ls.setLevel(Level.WARN);
		assert.isTrue(ls.isWarn());
	});

	it("LoggerService setLevel - ERROR", () => {
		ls.setLevel(Level.ERROR);
		assert.isTrue(ls.isError());
	});

	it("LoggerService setLevel - FATAL", () => {
		ls.setLevel(Level.FATAL);
		assert.isTrue(ls.isFatal());
	});

	it("LoggerService setLevel - DISABLED", () => {
		ls.setLevel(Level.DISABLED);
		assert.isTrue(ls.isDisabled());
	});

});
