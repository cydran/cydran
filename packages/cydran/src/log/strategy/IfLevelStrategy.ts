import { Appender } from "log/appender/Appender";

export interface IflevelStrategy {

	/**
	 * Only if log at a "trace" level execute fn() to derive payload to log
	 * @param logName of the { Logger }
	 * @param pender the { Appender } to write to
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	ifTrace(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void;

	/**
	 * Only if log at a "debug" level execute fn() to derive payload to log
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	ifDebug(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void;

	/**
	 * Only if log at a "info" level execute fn() to derive payload to log
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	ifInfo(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void;

	/**
	 * Only if log at a "warn" level execute fn() to derive payload to log
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	ifWarn(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void;

	/**
	 * Only if log at a "error" level execute fn() to derive payload to log
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	ifError(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void;

	/**
	 * Only if log at a "fatal" level execute fn() to derive payload to log
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	ifFatal(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void;

}