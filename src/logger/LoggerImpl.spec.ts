import { assert } from "chai";
import { describe, it, xit } from "mocha";
import Mockito from "ts-mockito";
import { anything, instance, mock, verify, when } from "ts-mockito";
import Level from "@/logger/Level";
import Logger from "@/logger/Logger";
import LoggerImpl from "@/logger/LoggerImpl";
import LoggerService from "@/logger/LoggerService";
import LoggerServiceImpl from "@/logger/LoggerServiceImpl";

describe("LogggerImpl tests", () => {

	it("LogggerImpl isTrace()", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.isTrace();
		verify(loggerServiceMock.isTrace()).once();
	});

	it("LogggerImpl isDebug()", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.isDebug();
		verify(loggerServiceMock.isDebug()).once();
	});

	it("LogggerImpl isInfo()", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.isInfo();
		verify(loggerServiceMock.isInfo()).once();
	});

	it("LogggerImpl isWarn()", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.isWarn();
		verify(loggerServiceMock.isWarn()).once();
	});

	it("LogggerImpl isError()", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.isError();
		verify(loggerServiceMock.isError()).once();
	});

	it("LogggerImpl isFatal()", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.isFatal();
		verify(loggerServiceMock.isFatal()).once();
	});

	it("LogggerImpl isDisabled()", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.isDisabled();
		verify(loggerServiceMock.isDisabled()).once();
	});

	it("LogggerImpl ifTrace(null)", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.ifTrace(null);
		verify(loggerServiceMock.isTrace()).never();
		verify(loggerServiceMock.log(anything(), anything(), anything())).never();
	});

	it("LogggerImpl ifDebug(null)", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.ifDebug(null);
		verify(loggerServiceMock.isDebug()).never();
		verify(loggerServiceMock.log(anything(), anything(), anything())).never();
	});

	it("LogggerImpl ifInfo(null)", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.ifInfo(null);
		verify(loggerServiceMock.isInfo()).never();
		verify(loggerServiceMock.log(anything(), anything(), anything())).never();
	});

	it("LogggerImpl ifWarn(null)", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.ifWarn(null);
		verify(loggerServiceMock.isWarn()).never();
		verify(loggerServiceMock.log(anything(), anything(), anything())).never();
	});

	it("LogggerImpl ifError(null)", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.ifError(null);
		verify(loggerServiceMock.isError()).never();
		verify(loggerServiceMock.log(anything(), anything(), anything())).never();
	});

	it("LogggerImpl ifFatal(null)", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.ifFatal(null);
		verify(loggerServiceMock.isFatal()).never();
		verify(loggerServiceMock.log(anything(), anything(), anything())).never();
	});

	it("LogggerImpl ifTrace(() => 'Hello World')", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		when(loggerServiceMock.isTrace()).thenReturn(true);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.ifTrace(() => "Hello World");
		verify(loggerServiceMock.isTrace()).once();
		verify(loggerServiceMock.log(anything(), Level.TRACE, "Hello World", undefined)).once();
	});

	it("LogggerImpl ifDebug(() => 'Hello World')", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		when(loggerServiceMock.isDebug()).thenReturn(true);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.ifDebug(() => "Hello World");
		verify(loggerServiceMock.isDebug()).once();
		verify(loggerServiceMock.log(anything(), Level.DEBUG, "Hello World", undefined)).once();
	});

	it("LogggerImpl ifInfo(() => 'Hello World')", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		when(loggerServiceMock.isInfo()).thenReturn(true);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.ifInfo(() => "Hello World");
		verify(loggerServiceMock.isInfo()).once();
		verify(loggerServiceMock.log(anything(), Level.INFO, "Hello World", undefined)).once();
	});

	it("LogggerImpl ifWarn(() => 'Hello World')", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		when(loggerServiceMock.isWarn()).thenReturn(true);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.ifWarn(() => "Hello World");
		verify(loggerServiceMock.isWarn()).once();
		verify(loggerServiceMock.log(anything(), Level.WARN, "Hello World", undefined)).once();
	});

	it("LogggerImpl ifError(() => 'Hello World')", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		when(loggerServiceMock.isError()).thenReturn(true);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.ifError(() => "Hello World");
		verify(loggerServiceMock.isError()).once();
		verify(loggerServiceMock.log(anything(), Level.ERROR, "Hello World", undefined)).once();
	});

	it("LogggerImpl ifFatal(() => 'Hello World')", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		when(loggerServiceMock.isFatal()).thenReturn(true);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.ifFatal(() => "Hello World");
		verify(loggerServiceMock.isFatal()).once();
		verify(loggerServiceMock.log(anything(), Level.FATAL, "Hello World", undefined)).once();
	});

	it("LogggerImpl ifTrace(() => 'Hello World') - Level disabled", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		when(loggerServiceMock.isTrace()).thenReturn(false);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.ifTrace(() => "Hello World");
		verify(loggerServiceMock.isTrace()).once();
		verify(loggerServiceMock.log(anything(), anything(), anything(), anything())).never();
	});

	it("LogggerImpl ifDebug(() => 'Hello World') - Level disabled", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		when(loggerServiceMock.isDebug()).thenReturn(false);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.ifDebug(() => "Hello World");
		verify(loggerServiceMock.isDebug()).once();
		verify(loggerServiceMock.log(anything(), anything(), anything(), anything())).never();
	});

	it("LogggerImpl ifInfo(() => 'Hello World') - Level disabled", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		when(loggerServiceMock.isInfo()).thenReturn(false);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.ifInfo(() => "Hello World");
		verify(loggerServiceMock.isInfo()).once();
		verify(loggerServiceMock.log(anything(), anything(), anything(), anything())).never();
	});

	it("LogggerImpl ifWarn(() => 'Hello World') - Level disabled", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		when(loggerServiceMock.isWarn()).thenReturn(false);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.ifWarn(() => "Hello World");
		verify(loggerServiceMock.isWarn()).once();
		verify(loggerServiceMock.log(anything(), anything(), anything(), anything())).never();
	});

	it("LogggerImpl ifError(() => 'Hello World') - Level disabled", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		when(loggerServiceMock.isError()).thenReturn(false);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.ifError(() => "Hello World");
		verify(loggerServiceMock.isError()).once();
		verify(loggerServiceMock.log(anything(), anything(), anything(), anything())).never();
	});

	it("LogggerImpl ifFatal(() => 'Hello World') - Level disabled", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		when(loggerServiceMock.isFatal()).thenReturn(false);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.ifFatal(() => "Hello World");
		verify(loggerServiceMock.isFatal()).once();
		verify(loggerServiceMock.log(anything(), anything(), anything(), anything())).never();
	});

	it("LogggerImpl trace('Hello World')", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.trace("Hello World");
		verify(loggerServiceMock.log(anything(), Level.TRACE, "Hello World", undefined)).once();
	});

	it("LogggerImpl debug('Hello World')", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.debug("Hello World");
		verify(loggerServiceMock.log(anything(), Level.DEBUG, "Hello World", undefined)).once();
	});

	it("LogggerImpl info('Hello World')", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.info("Hello World");
		verify(loggerServiceMock.log(anything(), Level.INFO, "Hello World", undefined)).once();
	});

	it("LogggerImpl warn('Hello World')", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.warn("Hello World");
		verify(loggerServiceMock.log(anything(), Level.WARN, "Hello World", undefined)).once();
	});

	it("LogggerImpl error('Hello World')", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.error("Hello World");
		verify(loggerServiceMock.log(anything(), Level.ERROR, "Hello World", undefined)).once();
	});

	it("LogggerImpl fatal('Hello World')", () => {
		const loggerServiceMock: LoggerService = mock(LoggerServiceImpl);
		const specimen: Logger = new LoggerImpl("test", instance(loggerServiceMock));
		specimen.fatal("Hello World");
		verify(loggerServiceMock.log(anything(), Level.FATAL, "Hello World", undefined)).once();
	});

});
