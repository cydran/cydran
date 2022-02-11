import { anything, instance, mock, verify, when } from "ts-mockito";
import LoggerService from 'log/LoggerService';
import LoggerServiceImpl from 'log/LoggerServiceImpl';
import Logger from 'log/Logger';
import LoggerImpl from 'log/LoggerImpl';
import Level from 'log/Level';
import { enumKeys, isDefined } from "util/Utils";

const logName: string = "test";
const HELLO: string = "Hello World";

test("getName(): string", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	const result: string = specimen.getName().trim();
	expect(result).toEqual(logName);
});

test("isTrace()", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.isTrace();
	verify(loggerServiceMock.isTrace()).once();
});

test("isDebug()", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.isDebug();
	verify(loggerServiceMock.isDebug()).once();
});

test("isInfo()", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.isInfo();
	verify(loggerServiceMock.isInfo()).once();
});

test("isWarn()", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.isWarn();
	verify(loggerServiceMock.isWarn()).once();
});

test("isError()", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.isError();
	verify(loggerServiceMock.isError()).once();
});

test("isFatal()", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.isFatal();
	verify(loggerServiceMock.isFatal()).once();
});

test("isDisabled()", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.isDisabled();
	verify(loggerServiceMock.isDisabled()).once();
});

test("ifTrace(null)", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifTrace(null);
	verify(loggerServiceMock.isTrace()).never();
	verify(loggerServiceMock.log(anything(), anything(), anything())).never();
});

test("ifDebug(null)", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifDebug(null);
	verify(loggerServiceMock.isDebug()).never();
	verify(loggerServiceMock.log(anything(), anything(), anything())).never();
});

test("ifInfo(null)", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifInfo(null);
	verify(loggerServiceMock.isInfo()).never();
	verify(loggerServiceMock.log(anything(), anything(), anything())).never();
});

test("ifWarn(null)", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifWarn(null);
	verify(loggerServiceMock.isWarn()).never();
	verify(loggerServiceMock.log(anything(), anything(), anything())).never();
});

test("ifError(null)", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifError(null);
	verify(loggerServiceMock.isError()).never();
	verify(loggerServiceMock.log(anything(), anything(), anything())).never();
});

test("ifFatal(null)", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifFatal(null);
	verify(loggerServiceMock.isFatal()).never();
	verify(loggerServiceMock.log(anything(), anything(), anything())).never();
});

test("ifTrace(() => 'Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isTrace()).thenReturn(true);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifTrace(() => HELLO);
	verify(loggerServiceMock.isTrace()).once();
	verify(loggerServiceMock.log(anything(), Level.TRACE, HELLO, undefined)).once();
});

test("ifDebug(() => 'Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isDebug()).thenReturn(true);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifDebug(() => HELLO);
	verify(loggerServiceMock.isDebug()).once();
	verify(loggerServiceMock.log(anything(), Level.DEBUG, HELLO, undefined)).once();
});

test("ifInfo(() => 'Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isInfo()).thenReturn(true);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifInfo(() => HELLO);
	verify(loggerServiceMock.isInfo()).once();
	verify(loggerServiceMock.log(anything(), Level.INFO, HELLO, undefined)).once();
});

test("ifWarn(() => 'Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isWarn()).thenReturn(true);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifWarn(() => HELLO);
	verify(loggerServiceMock.isWarn()).once();
	verify(loggerServiceMock.log(anything(), Level.WARN, HELLO, undefined)).once();
});

test("ifError(() => 'Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isError()).thenReturn(true);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifError(() => HELLO);
	verify(loggerServiceMock.isError()).once();
	verify(loggerServiceMock.log(anything(), Level.ERROR, HELLO, undefined)).once();
});

test("ifFatal(() => 'Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isFatal()).thenReturn(true);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifFatal(() => HELLO);
	verify(loggerServiceMock.isFatal()).once();
	verify(loggerServiceMock.log(anything(), Level.FATAL, HELLO, undefined)).once();
});

test("ifTrace(() => 'Hello World') - Level disabled", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isTrace()).thenReturn(false);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifTrace(() => HELLO);
	verify(loggerServiceMock.isTrace()).once();
	verify(loggerServiceMock.log(anything(), anything(), anything(), anything())).never();
});

test("ifDebug(() => 'Hello World') - Level disabled", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isDebug()).thenReturn(false);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifDebug(() => HELLO);
	verify(loggerServiceMock.isDebug()).once();
	verify(loggerServiceMock.log(anything(), anything(), anything(), anything())).never();
});

test("ifInfo(() => 'Hello World') - Level disabled", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isInfo()).thenReturn(false);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifInfo(() => HELLO);
	verify(loggerServiceMock.isInfo()).once();
	verify(loggerServiceMock.log(anything(), anything(), anything(), anything())).never();
});

test("ifWarn(() => 'Hello World') - Level disabled", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isWarn()).thenReturn(false);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifWarn(() => HELLO);
	verify(loggerServiceMock.isWarn()).once();
	verify(loggerServiceMock.log(anything(), anything(), anything(), anything())).never();
});

test("ifError(() => 'Hello World') - Level disabled", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isError()).thenReturn(false);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifError(() => HELLO);
	verify(loggerServiceMock.isError()).once();
	verify(loggerServiceMock.log(anything(), anything(), anything(), anything())).never();
});

test("ifFatal(() => 'Hello World') - Level disabled", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isFatal()).thenReturn(false);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifFatal(() => HELLO);
	verify(loggerServiceMock.isFatal()).once();
	verify(loggerServiceMock.log(anything(), anything(), anything(), anything())).never();
});

test("trace('Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.trace(HELLO);
	verify(loggerServiceMock.log(anything(), Level.TRACE, HELLO, undefined)).once();
});

test("debug('Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.debug(HELLO);
	verify(loggerServiceMock.log(anything(), Level.DEBUG, HELLO, undefined)).once();
});

test("info('Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.info(HELLO);
	verify(loggerServiceMock.log(anything(), Level.INFO, HELLO, undefined)).once();
});

test("warn('Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.warn(HELLO);
	verify(loggerServiceMock.log(anything(), Level.WARN, HELLO, undefined)).once();
});

test("error('Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.error(HELLO);
	verify(loggerServiceMock.log(anything(), Level.ERROR, HELLO, undefined)).once();
});

test("fatal('Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.fatal(HELLO);
	verify(loggerServiceMock.log(anything(), Level.FATAL, HELLO, undefined)).once();
});
