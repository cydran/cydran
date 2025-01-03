import Level from "log/Level";
import { Properties } from "properties/Property";

export interface Appender {

	/**
	 * Log payload at a "trace" level
	 * @param label name of logger
	 * @param msgBase to be written out
	 * @param params detail or error objects
	 */
	trace(label: string, msgBase: string, ...params: any): void;

	/**
	 * Log payload at a "debug" level
	 * @param label name of logger
	 * @param msgBase to be written out
	 * @param params detail or error objects
	 */
	debug(label: string, msgBase: string, ...params: any): void;

	/**
	 * Log payload at a "info" level
	 * @param label name of logger
	 * @param msgBase to be written out
	 * @param params detail or error objects
	 */
	info(label: string, msgBase: string, ...params: any): void;

	/**
	 * Log payload at a "warn" level
	 * @param label name of logger
	 * @param msgBase to be written out
	 * @param params detail or error objects
	 */
	warn(label: string, msgBase: string, ...params: any): void;

	/**
	 * Log payload at a "error" level
	 * @param label name of logger
	 * @param msgBase to be written out
	 * @param params detail or error objects
	 */
	error(label: string, msgBase: string, ...params: any): void;

	/**
	 * Log payload at a "fatal" level
	 * @param label name of logger
	 * @param msgBase to be written out
	 * @param params detail or error objects
	 */
	fatal(label: string, msgBase: string, ...params: any): void;

	/**
	 * Log the message
	 * @param level log at provided level
	 * @param label name of logger
	 * @param msgBase to be written out
	 * @param params detail or error objects
	 */
	log(level: Level, label: string, msgBase: string, ...params: any): void;

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
