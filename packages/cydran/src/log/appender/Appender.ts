export interface Appender {

	/**
	 * Log payload at a "trace" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with detail data
	 */
	trace(payload: any, error?: Error): void;

	/**
	 * Log payload at a "debug" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with detail data
	 */
	debug(payload: any, error?: Error): void;

	/**
	 * Log payload at a "info" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with detail data
	 */
	info(payload: any, error?: Error): void;

	/**
	 * Log payload at a "warn" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with detail data
	 */
	warn(payload: any, error?: Error): void;

	/**
	 * Log payload at a "error" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with detail data
	 */
	error(payload: any, error?: Error): void;

	/**
	 * Log payload at a "fatal" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with detail data
	 */
	fatal(payload: any, error?: Error): void;

}
