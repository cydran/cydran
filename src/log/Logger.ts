import Level from "log/Level";

interface Logger {
	/**
	 * Get the name of the logger
	 * @returns string
	 */
	getName(): string;

	/**
	 * Log payload at a "trace" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with contextual data
	 */
	trace(payload: any, error?: Error): void;

	/**
	 * Only if log at a "trace" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param error optional if there is an error object with contextual data
	 */
	ifTrace(payloadFn: () => any, error?: Error): void;

	/**
	 * Log payload at a "debug" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with contextual data
	 */
	debug(payload: any, error?: Error): void;

	/**
	 * Only if log at a "debug" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param error optional if there is an error object with contextual data
	 */
	ifDebug(payloadFn: () => any, error?: Error): void;

	/**
	 * Log payload at a "info" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with contextual data
	 */
	info(payload: any, error?: Error): void;

	/**
	 * Only if log at a "info" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param error optional if there is an error object with contextual data
	 */
	ifInfo(payloadFn: () => any, error?: Error): void;

	/**
	 * Log payload at a "warn" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with contextual data
	 */
	warn(payload: any, error?: Error): void;

	/**
	 * Only if log at a "warn" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param error optional if there is an error object with contextual data
	 */
	ifWarn(payloadFn: () => any, error?: Error): void;

	/**
	 * Log payload at a "error" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with contextual data
	 */
	 error(payload: any, error?: Error): void;

	/**
	 * Only if log at a "error" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param error optional if there is an error object with contextual data
	 */
	ifError(payloadFn: () => any, error?: Error): void;

	/**
	 * Log payload at a "fatal" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with contextual data
	 */
	fatal(payload: any, error?: Error): void;

	/**
	 * Only if log at a "fatal" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param error optional if there is an error object with contextual data
	 */
	ifFatal(payloadFn: () => any, error?: Error): void;

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
	 * Is the log level at least at "disabled" level
	 * @returns boolean
	 */
	isDisabled(): boolean;

	/**
	 * Set a custom level for the logger
	 * @param level {Level} object denoting custom setting
	 */
	setLevel(level: Level): void;

	/**
	 * Get the current {Level level} for this logger
	 * @returns a {Level} object
	 */
	getLevel(): Level;

}

export default Logger;
