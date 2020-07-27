import { LoggerImpl, LoggerServiceImpl } from "@/Logger";
import { anything, instance, mock, verify, when } from "ts-mockito";
import { LoggerService, Logger, Level } from '@/Interfaces';

const logName: string = "test";
const HELLO: string = "Hello World";

it("getName(): string", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	const result: string = specimen.getName().trim();
	expect(result).toEqual(logName);
});

it("isTrace()", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.isTrace();
	verify(loggerServiceMock.isTrace()).once();
});

it("isDebug()", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.isDebug();
	verify(loggerServiceMock.isDebug()).once();
});

it("isInfo()", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.isInfo();
	verify(loggerServiceMock.isInfo()).once();
});

it("isWarn()", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.isWarn();
	verify(loggerServiceMock.isWarn()).once();
});

it("isError()", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.isError();
	verify(loggerServiceMock.isError()).once();
});

it("isFatal()", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.isFatal();
	verify(loggerServiceMock.isFatal()).once();
});

it("isDisabled()", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.isDisabled();
	verify(loggerServiceMock.isDisabled()).once();
});

it("ifTrace(null)", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifTrace(null);
	verify(loggerServiceMock.isTrace()).never();
	verify(loggerServiceMock.log(anything(), anything(), anything())).never();
});

it("ifDebug(null)", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifDebug(null);
	verify(loggerServiceMock.isDebug()).never();
	verify(loggerServiceMock.log(anything(), anything(), anything())).never();
});

it("ifInfo(null)", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifInfo(null);
	verify(loggerServiceMock.isInfo()).never();
	verify(loggerServiceMock.log(anything(), anything(), anything())).never();
});

it("ifWarn(null)", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifWarn(null);
	verify(loggerServiceMock.isWarn()).never();
	verify(loggerServiceMock.log(anything(), anything(), anything())).never();
});

it("ifError(null)", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifError(null);
	verify(loggerServiceMock.isError()).never();
	verify(loggerServiceMock.log(anything(), anything(), anything())).never();
});

it("ifFatal(null)", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifFatal(null);
	verify(loggerServiceMock.isFatal()).never();
	verify(loggerServiceMock.log(anything(), anything(), anything())).never();
});

it("ifTrace(() => 'Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isTrace()).thenReturn(true);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifTrace(() => HELLO);
	verify(loggerServiceMock.isTrace()).once();
	verify(loggerServiceMock.log(anything(), Level.TRACE, HELLO, undefined)).once();
});

it("ifDebug(() => 'Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isDebug()).thenReturn(true);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifDebug(() => HELLO);
	verify(loggerServiceMock.isDebug()).once();
	verify(loggerServiceMock.log(anything(), Level.DEBUG, HELLO, undefined)).once();
});

it("ifInfo(() => 'Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isInfo()).thenReturn(true);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifInfo(() => HELLO);
	verify(loggerServiceMock.isInfo()).once();
	verify(loggerServiceMock.log(anything(), Level.INFO, HELLO, undefined)).once();
});

it("ifWarn(() => 'Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isWarn()).thenReturn(true);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifWarn(() => HELLO);
	verify(loggerServiceMock.isWarn()).once();
	verify(loggerServiceMock.log(anything(), Level.WARN, HELLO, undefined)).once();
});

it("ifError(() => 'Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isError()).thenReturn(true);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifError(() => HELLO);
	verify(loggerServiceMock.isError()).once();
	verify(loggerServiceMock.log(anything(), Level.ERROR, HELLO, undefined)).once();
});

it("ifFatal(() => 'Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isFatal()).thenReturn(true);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifFatal(() => HELLO);
	verify(loggerServiceMock.isFatal()).once();
	verify(loggerServiceMock.log(anything(), Level.FATAL, HELLO, undefined)).once();
});

it("ifTrace(() => 'Hello World') - Level disabled", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isTrace()).thenReturn(false);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifTrace(() => HELLO);
	verify(loggerServiceMock.isTrace()).once();
	verify(loggerServiceMock.log(anything(), anything(), anything(), anything())).never();
});

it("ifDebug(() => 'Hello World') - Level disabled", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isDebug()).thenReturn(false);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifDebug(() => HELLO);
	verify(loggerServiceMock.isDebug()).once();
	verify(loggerServiceMock.log(anything(), anything(), anything(), anything())).never();
});

it("ifInfo(() => 'Hello World') - Level disabled", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isInfo()).thenReturn(false);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifInfo(() => HELLO);
	verify(loggerServiceMock.isInfo()).once();
	verify(loggerServiceMock.log(anything(), anything(), anything(), anything())).never();
});

it("ifWarn(() => 'Hello World') - Level disabled", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isWarn()).thenReturn(false);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifWarn(() => HELLO);
	verify(loggerServiceMock.isWarn()).once();
	verify(loggerServiceMock.log(anything(), anything(), anything(), anything())).never();
});

it("ifError(() => 'Hello World') - Level disabled", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isError()).thenReturn(false);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifError(() => HELLO);
	verify(loggerServiceMock.isError()).once();
	verify(loggerServiceMock.log(anything(), anything(), anything(), anything())).never();
});

it("ifFatal(() => 'Hello World') - Level disabled", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	when(loggerServiceMock.isFatal()).thenReturn(false);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.ifFatal(() => HELLO);
	verify(loggerServiceMock.isFatal()).once();
	verify(loggerServiceMock.log(anything(), anything(), anything(), anything())).never();
});

it("trace('Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.trace(HELLO);
	verify(loggerServiceMock.log(anything(), Level.TRACE, HELLO, undefined)).once();
});

it("debug('Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.debug(HELLO);
	verify(loggerServiceMock.log(anything(), Level.DEBUG, HELLO, undefined)).once();
});

it("info('Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.info(HELLO);
	verify(loggerServiceMock.log(anything(), Level.INFO, HELLO, undefined)).once();
});

it("warn('Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.warn(HELLO);
	verify(loggerServiceMock.log(anything(), Level.WARN, HELLO, undefined)).once();
});

it("error('Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.error(HELLO);
	verify(loggerServiceMock.log(anything(), Level.ERROR, HELLO, undefined)).once();
});

it("fatal('Hello World')", () => {
	const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
	const specimen: Logger = new LoggerImpl(logName, instance(loggerServiceMock));
	specimen.fatal(HELLO);
	verify(loggerServiceMock.log(anything(), Level.FATAL, HELLO, undefined)).once();
});
