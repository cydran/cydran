import Level from "log/Level";

export interface Appender {

	/**
	 * Log payload at a "trace" level
	 * @param name name of logger
	 * @param payload to be written out
	 * @param params detail or error objects
	 */
	trace(name: string, payload: any, ...params: any): void;

	/**
	 * Log payload at a "debug" level
	 * @param name name of logger
	 * @param payload to be written out
	 * @param params detail or error objects
	 */
	debug(name: string, payload: any, ...params: any): void;

	/**
	 * Log payload at a "info" level
	 * @param name name of logger
	 * @param payload to be written out
	 * @param params detail or error objects
	 */
	info(name: string, payload: any, ...params: any): void;

	/**
	 * Log payload at a "warn" level
	 * @param name name of logger
	 * @param payload to be written out
	 * @param params detail or error objects
	 */
	warn(name: string, payload: any, ...params: any): void;

	/**
	 * Log payload at a "error" level
	 * @param name name of logger
	 * @param payload to be written out
	 * @param params detail or error objects
	 */
	error(name: string, payload: any, ...params: any): void;

	/**
	 * Log payload at a "fatal" level
	 * @param name name of logger
	 * @param payload to be written out
	 * @param params detail or error objects
	 */
	fatal(name: string, payload: any, ...params: any): void;

	/**
	 * Log the message
	 * @param level log at provided level
	 * @param name name of logger
	 * @param payload to be written out
	 * @param params detail or error objects
	 */
	log(level: Level, name: string, payload: any, ...params: any): void;

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
}
