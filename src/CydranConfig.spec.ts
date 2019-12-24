import { assert } from "chai";
import { describe, it, xit } from "mocha";
import CydranConfig from "@/CydranConfig";
import LoggerServiceImpl from "@/logger/LoggerServiceImpl";

describe("CydranConfig tests", () => {

	it("new CydranConfig()", () => {
		const instance: CydranConfig = new CydranConfig();
		assert.isNotNull(instance, "is null");
	});

	it("useTrace()", () => {
		const cc: CydranConfig = new CydranConfig();
		cc.useTrace();
		const ls = LoggerServiceImpl.INSTANCE;
		assert.isTrue(ls.isTrace());
	});

	it("useDebug()", () => {
		const cc: CydranConfig = new CydranConfig();
		cc.useDebug();
		const ls = LoggerServiceImpl.INSTANCE;
		assert.isTrue(ls.isDebug());
	});

	it("useInfo()", () => {
		const cc: CydranConfig = new CydranConfig();
		cc.useInfo();
		const ls = LoggerServiceImpl.INSTANCE;
		assert.isTrue(ls.isInfo());
	});

	it("useWarn()", () => {
		const cc: CydranConfig = new CydranConfig();
		cc.useWarn();
		const ls = LoggerServiceImpl.INSTANCE;
		assert.isTrue(ls.isWarn());
	});

	it("useError()", () => {
		const cc: CydranConfig = new CydranConfig();
		cc.useError();
		const ls = LoggerServiceImpl.INSTANCE;
		assert.isTrue(ls.isError());
	});

	it("useFatal()", () => {
		const cc: CydranConfig = new CydranConfig();
		cc.useFatal();
		const ls = LoggerServiceImpl.INSTANCE;
		assert.isTrue(ls.isFatal());
	});

	it("useDisabled()", () => {
		const cc: CydranConfig = new CydranConfig();
		cc.useDisabled();
		const ls = LoggerServiceImpl.INSTANCE;
		assert.isTrue(ls.isDisabled());
	});

});
