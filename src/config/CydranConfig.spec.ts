import CydranConfig from "@/config/CydranConfig";
import LoggerServiceImpl from "@/logger/LoggerServiceImpl";

test("new CydranConfig()", () => {
	const instance: CydranConfig = new CydranConfig();
	expect(instance).not.toBeNull();
});

test("useTrace()", () => {
	const cc: CydranConfig = new CydranConfig();
	cc.useTrace();
	const ls = LoggerServiceImpl.INSTANCE;
	expect(ls.isTrace()).toEqual(true);
});

test("useDebug()", () => {
	const cc: CydranConfig = new CydranConfig();
	cc.useDebug();
	const ls = LoggerServiceImpl.INSTANCE;
	expect(ls.isDebug()).toEqual(true);
});

test("useInfo()", () => {
	const cc: CydranConfig = new CydranConfig();
	cc.useInfo();
	const ls = LoggerServiceImpl.INSTANCE;
	expect(ls.isInfo()).toEqual(true);
});

test("useWarn()", () => {
	const cc: CydranConfig = new CydranConfig();
	cc.useWarn();
	const ls = LoggerServiceImpl.INSTANCE;
	expect(ls.isWarn()).toEqual(true);
});

test("useError()", () => {
	const cc: CydranConfig = new CydranConfig();
	cc.useError();
	const ls = LoggerServiceImpl.INSTANCE;
	expect(ls.isError()).toEqual(true);
});

test("useFatal()", () => {
	const cc: CydranConfig = new CydranConfig();
	cc.useFatal();
	const ls = LoggerServiceImpl.INSTANCE;
	expect(ls.isFatal()).toEqual(true);
});

test("useDisabled()", () => {
	const cc: CydranConfig = new CydranConfig();
	cc.useDisabled();
	const ls = LoggerServiceImpl.INSTANCE;
	expect(ls.isDisabled()).toEqual(true);
});
