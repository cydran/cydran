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
	 * @param error send to log error stack regardless of level
	 */
	trace(label: string, message: string, error?: Error | null): void;

	/**
	 * Log payload at a "debug" level
	 * @param label name of logger
	 * @param message to be written out
	 * @param error send to log error stack regardless of level
	 */
	debug(label: string, message: string, error?: Error | null): void;

	/**
	 * Log payload at a "info" level
	 * @param label name of logger
	 * @param message to be written out
	 * @param error send to log error stack regardless of level
	 */
	info(label: string, message: string, error?: Error | null): void;

	/**
	 * Log payload at a "warn" level
	 * @param label name of logger
	 * @param message to be written out
	 * @param error send to log error stack regardless of level
	 */
	warn(label: string, message: string, error?: Error | null): void;

	/**
	 * Log payload at a "error" level
	 * @param label name of logger
	 * @param message to be written out
	 * @param error send to log error stack regardless of level
	 */
	error(label: string, message: string, error?: Error | null): void;

	/**
	 * Log payload at a "fatal" level
	 * @param label name of logger
	 * @param message to be written out
	 * @param error send to log error stack regardless of level
	 */
	fatal(label: string, message: string, error?: Error | null): void;

}
