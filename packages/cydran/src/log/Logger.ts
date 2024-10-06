import { Appender } from "log/appender/Appender";
import { IsLevelType } from "log/IsLevelType";
import Level from "log/Level";

interface Logger extends IsLevelType {

	/**
	 * Get the name of the logger
	 * @returns string
	 */
	getName(): string;

	/**
	 * Only if log at a "trace" level execute fn() to derive payload to log
	 * @param payloadFn to check if to be written
	 * @param param detail or error objects
	 */
	ifTrace(payloadFn: () => any, ...param: any): void;
	/**
	 * Only if log at a "debug" level execute fn() to derive payload to log
	 * @param payloadFn to check if to be written
	 * @param param detail or error objects
	 */
	ifDebug(payloadFn: () => any, ...param: any): void;

	/**
	 * Only if log at a "info" level execute fn() to derive payload to log
	 * @param payloadFn to check if to be written
	 * @param param detail or error objects
	 */
	ifInfo(payloadFn: () => any, ...param: any): void;

	/**
	 * Only if log at a "warn" level execute fn() to derive payload to log
	 * @param payloadFn to check if to be written
	 * @param param detail or error objects
	 */
	ifWarn(payloadFn: () => any, ...param: any): void;

	/**
	 * Only if log at a "error" level execute fn() to derive payload to log
	 * @param payloadFn to check if to be written
	 * @param param detail or error objects
	 */
	ifError(payloadFn: () => any, ...param: any): void;

	/**
	 * Only if log at a "fatal" level execute fn() to derive payload to log
	 * @param payloadFn to check if to be written
	 * @param param detail or error objects
	 */
	ifFatal(payloadFn: () => any, ...param: any): void;

	/**
	 * Get the current {Level level} for this logger
	 * @returns a {Level} object
	 */
	getLevel(): Level;

	/**
	 * Log payload at a "trace" level
	 * @param payload to be written out
	 * @param params detail or error objects
	 */
	trace(payload: any, ...params: any): void;

	/**
	 * Log payload at a "debug" level
	 * @param payload to be written out
	 * @param params detail or error objects
	 */
	debug(payload: any, ...params: any): void;

	/**
	 * Log payload at a "info" level
	 * @param payload to be written out
	 * @param params detail or error objects
	 */
	info(payload: any, ...params: any): void;

	/**
	 * Log payload at a "warn" level
	 * @param payload to be written out
	 * @param params detail or error objects
	 */
	warn(payload: any, ...params: any): void;

	/**
	 * Log payload at a "error" level
	 * @param payload to be written out
	 * @param params detail or error objects
	 */
	error(payload: any, ...params: any): void;

	/**
	 * Log payload at a "fatal" level
	 * @param payload to be written out
	 * @param params detail or error objects
	 */
	fatal(payload: any, ...params: any): void;

	/**
	 * Log the message
	 * @param level log at provided level
	 * @param payload to be written out
	 * @param params detail or error objects
	 */
	log(level: Level, payload: any, ...params: any): void;
}

export default Logger;
