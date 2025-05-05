export interface Appender {

	/**
	 * Get the id of the strategy
	 * @returns
	 */
	getId(): string;

	/**
	 * Get the alias of the appender.
	 * @returns
	 */
	getAlias(): string;

	/**
	 * Log payload at a "trace" level
	 * @param label name of logger
	 * @param message to be written out
	 * @param error error object to log stack with
	 * @param moreArgs additional objects to log
	 */
	trace(label: string, message: string, error?: Error, moreArgs?: unknown[]): void;

	/**
	 * Log payload at a "debug" level
	 * @param label name of logger
	 * @param message to be written out
	 * @param error error object to log stack with
	 */
	debug(label: string, message: string, error?: Error, moreArgs?: unknown[]): void;

	/**
	 * Log payload at a "info" level
	 * @param label name of logger
	 * @param message to be written out
	 * @param error error object to log stack with
	 */
	info(label: string, message: string, error?: Error, moreArgs?: unknown[]): void;

	/**
	 * Log payload at a "warn" level
	 * @param label name of logger
	 * @param message to be written out
	 * @param error error object to log stack with
	 */
	warn(label: string, message: string, error?: Error, moreArgs?: unknown[]): void;

	/**
	 * Log payload at a "error" level
	 * @param label name of logger
	 * @param message to be written out
	 * @param error error object to log stack with
	 */
	error(label: string, message: string, error?: Error, moreArgs?: unknown[]): void;

	/**
	 * Log payload at a "fatal" level
	 * @param label name of logger
	 * @param message to be written out
	 * @param error error object to log stack with
	 */
	fatal(label: string, message: string, error?: Error, moreArgs?: unknown[]): void;

}
