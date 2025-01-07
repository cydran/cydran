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
	 * @param moreArgs send to log additional args including possibly an Error
	 */
	trace(label: string, message: string, ...moreArgs: any): void;

	/**
	 * Log payload at a "debug" level
	 * @param label name of logger
	 * @param message to be written out
	 * @param moreArgs send to log additional args including possibly an Error
	 */
	debug(label: string, message: string, ...moreArgs: any): void;

	/**
	 * Log payload at a "info" level
	 * @param label name of logger
	 * @param message to be written out
	 * @param moreArgs send to log additional args including possibly an Error
	 */
	info(label: string, message: string, ...moreArgs: any): void;

	/**
	 * Log payload at a "warn" level
	 * @param label name of logger
	 * @param message to be written out
	 * @param moreArgs send to log additional args including possibly an Error
	 */
	warn(label: string, message: string, ...moreArgs: any): void;

	/**
	 * Log payload at a "error" level
	 * @param label name of logger
	 * @param message to be written out
	 * @param moreArgs send to log additional args including possibly an Error
	 */
	error(label: string, message: string, ...moreArgs: any): void;

	/**
	 * Log payload at a "fatal" level
	 * @param label name of logger
	 * @param message to be written out
	 * @param moreArgs send to log additional args including possibly an Error
	 */
	fatal(label: string, message: string, ...moreArgs: any): void;

}
