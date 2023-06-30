import Level from "log/Level";
import { Properties } from "properties/Property";

type StrategyResolver = () => OutputStrategy;

interface OutputStrategy {

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

	/**
	 * Set a tag for messages
	 * @param tag or label of the cydran instance
	 */
	setTag(tag: string): void;

	/**
	 * Set the visibility of the tag
	 * @param visible will the tag be visible or not; default of false;
	 */
	setTagVisibility(visible: boolean): void;

}

export { OutputStrategy, StrategyResolver };
