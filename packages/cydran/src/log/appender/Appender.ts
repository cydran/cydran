export interface Appender {

	/**
	 * Log payload at a "trace" level
	 * @param payload to be written out
	 * @param param detail or error objects
	 */
	trace(payload: any, ...param: any): void;

	/**
	 * Log payload at a "debug" level
	 * @param payload to be written out
	 * @param param detail or error objects
	 */
	debug(payload: any, ...param: any): void;

	/**
	 * Log payload at a "info" level
	 * @param payload to be written out
	 * @param param detail or error objects
	 */
	info(payload: any, ...param: any): void;

	/**
	 * Log payload at a "warn" level
	 * @param payload to be written out
	 * @param param detail or error objects
	 */
	warn(payload: any, ...param: any): void;

	/**
	 * Log payload at a "error" level
	 * @param payload to be written out
	 * @param param detail or error objects
	 */
	error(payload: any, ...param: any): void;

	/**
	 * Log payload at a "fatal" level
	 * @param payload to be written out
	 * @param param detail or error objects
	 */
	fatal(payload: any, ...param: any): void;

}
