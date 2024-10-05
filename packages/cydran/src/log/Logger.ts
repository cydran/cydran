import { Appender } from "log/appender/Appender";

interface Logger extends Appender {

	/**
	 * Get the name of the logger
	 * @returns string
	 */
	getName(): string;

	/**
	 * Only if log at a "trace" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param param detail or error objects
	 */
	ifTrace(payloadFn: () => any, ...param: any): void;
	/**
	 * Only if log at a "debug" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param param detail or error objects
	 */
	ifDebug(payloadFn: () => any, ...param: any): void;

	/**
	 * Only if log at a "info" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param param detail or error objects
	 */
	ifInfo(payloadFn: () => any, ...param: any): void;

	/**
	 * Only if log at a "warn" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param param detail or error objects
	 */
	ifWarn(payloadFn: () => any, ...param: any): void;

	/**
	 * Only if log at a "error" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param param detail or error objects
	 */
	ifError(payloadFn: () => any, ...param: any): void;

	/**
	 * Only if log at a "fatal" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param param detail or error objects
	 */
	ifFatal(payloadFn: () => any, ...param: any): void;

	/**
	 * Is the log level at least at "trace" level
	 * @returns boolean
	 */
	isTrace(): boolean;

	/**
	 * Is the log level at least at "debug" level
	 * @returns boolean
	 */
	isDebug(): boolean;

	/**
	 * Is the log level at least at "info" level
	 * @returns boolean
	 */
	isInfo(): boolean;

	/**
	 * Is the log level at least at "warn" level
	 * @returns boolean
	 */
	isWarn(): boolean;

	/**
	 * Is the log level at least at "error" level
	 * @returns boolean
	 */
	isError(): boolean;

	/**
	 * Is the log level at least at "fatal" level
	 * @returns boolean
	 */
	isFatal(): boolean;

	/**
	 * Get the current {Level level} for this logger
	 * @returns a {Level} object
	 */
	getLevel(): string;
}

export default Logger;
