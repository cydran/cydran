import Level from "log/Level";
import { Properties } from "properties/Property";

type StrategyResolver = () => OutputStrategy;

interface OutputStrategy {

	/**
	 * Log payload at a "trace" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with detail data
	 */
	trace(name: string, payload: any, error?: Error): void;


	/**
	 * Log payload at a "debug" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with detail data
	 */
	debug(name: string, payload: any, error?: Error): void;

	/**
	 * Log payload at a "info" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with detail data
	 */
	info(name: string, payload: any, error?: Error): void;

	/**
	 * Log payload at a "warn" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with detail data
	 */
	warn(name: string, payload: any, error?: Error): void;

	/**
	 * Log payload at a "error" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with detail data
	 */
	error(name: string, payload: any, error?: Error): void;

	/**
	 * Log payload at a "fatal" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with detail data
	 */
	fatal(name: string, payload: any, error?: Error): void;

	/**
	 * Log the message
	 * @param logname name of the log
	 * @param level {Level} of message
	 * @param payload message/object to be logged
	 * @param error optional object or boolean to indicate +/- on whether or not to log the stack/message
	 */
	log(logname: string, level: Level, payload: any, errorStack?: Error | boolean): void;

	/**
	 * Get the id of the strategy
	 * @returns
	 */
	getId(): string;

	/**
	 * Set the preferences for the output strategy
	 */
	setPreferences(props: Properties): void;

}

export { OutputStrategy, StrategyResolver };
