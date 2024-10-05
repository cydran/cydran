import Level from "log/Level";
import { Properties } from "properties/Property";
import { Appender } from "log/appender/Appender";

type StrategyResolver = () => OutputStrategy;

interface OutputStrategy extends Appender {

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
