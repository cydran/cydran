import { Appender } from "log/appender/Appender";

export interface IflevelStrategy {

	/**
	 * Only if log at a "trace" level execute fn() to derive payload to log
	 * @param logName of the { Logger }
	 * @param pender the { Appender } to write to
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments
	 */
	ifTrace(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void;

	/**
	 * Only if log at a "debug" level execute fn() to derive payload to log
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments
	 */
	ifDebug(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void;

	/**
	 * Only if log at a "info" level execute fn() to derive payload to log
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments
	 */
	ifInfo(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void;

	/**
	 * Only if log at a "warn" level execute fn() to derive payload to log
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments
	 */
	ifWarn(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void;

	/**
	 * Only if log at a "error" level execute fn() to derive payload to log
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments
	 */
	ifError(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void;

	/**
	 * Only if log at a "fatal" level execute fn() to derive payload to log
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments
	 */
	ifFatal(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void;

}