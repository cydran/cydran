import Level from 'log/Level';
import { Appender } from 'log/appender/Appender';

interface LoggerStrategy {

	/**
	 * Get the current {Level level} for this logger
	 * @returns a {Level} object
	 */
	getLevel(): Level;

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

	/**
	 * Log payload at a "trace" level
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param payload to be written out
	 * @param params additional optional arguments
	 */
	trace(logName: string, pender: Appender, payload: any, ...params: any): void;

	/**
	 * Log payload at a "debug" level
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param payload to be written out
	 * @param params additional optional arguments
	 */
	debug(logName: string, pender: Appender, payload: any, ...params: any): void;

	/**
	 * Log payload at a "info" level
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param payload to be written out
	 * @param params additional optional arguments
	 */
	info(logName: string, pender: Appender, payload: any, ...params: any): void;

	/**
	 * Log payload at a "warn" level
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param payload to be written out
	 * @param params additional optional arguments
	 */
	warn(logName: string, pender: Appender, payload: any, ...params: any): void;

	/**
	 * Log payload at a "error" level
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param payload to be written out
	 * @param params additional optional arguments
	 */
	error(logName: string, pender: Appender, payload: any, ...params: any): void;

	/**
	 * Log payload at a "fatal" level
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param payload to be written out
	 * @param params additional optional arguments
	 */
	fatal(logName: string, pender: Appender, payload: any, ...params: any): void;

}

export default LoggerStrategy;
