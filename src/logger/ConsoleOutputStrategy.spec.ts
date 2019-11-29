import { assert } from "chai";
import { describe, it, xit } from "mocha";
import ConsoleOutputStrategy from "./ConsoleOutputStrategy";
import Level from "./Level";
import Logger from "./Logger";
import LoggerFactory from "./LoggerFactory";

describe("ConsoleOutputStrategy tests", () => {

	const msg: string = "Testing message ---";
	const lgr: Logger = LoggerFactory.getLogger("ConsoleOutputStrategy.spec");
	const cos: ConsoleOutputStrategy = new ConsoleOutputStrategy();

	it(".log(logger, Level.WARN, msg)", () => {
		cos.log(lgr, Level.WARN, msg + "--- WARN");
	});

	it(".log(logger, Level.TRACE, msg, true)", () => {
		cos.log(lgr, Level.TRACE, msg, true);
	});

	it(".log(logger, Level.TRACE, msg, false)", () => {
		cos.log(lgr, Level.TRACE, msg, false);
	});

	it(".log(logger, Level.TRACE, msg) - implied false", () => {
		cos.log(lgr, Level.TRACE, msg);
	});

	it(".log(logger, Level.ERROR, msg, error)", () => {
		cos.log(lgr, Level.ERROR, msg, new Error("Working test error"));
	});

	it(".log(logger, Level.ERROR, error)", () => {
		cos.log(lgr, Level.ERROR, new Error("Working test error"));
	});

	it(".log(logger, Level.DEBUG, msg)", () => {
		cos.log(lgr, Level.DEBUG, msg + "--- DEBUG");
	});

	it(".log(logger, Level.INFO, msg)", () => {
		cos.log(lgr, Level.INFO, msg + "--- INFO");
	});

});
