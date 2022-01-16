import Level from "log/Level";
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
	 * Set a tag for messages
	 * @param tag associated with the cydran intance
	 */
	setTag(tag: string): void;

	/**
	 * Set the visibility of the tag
	 * @param visible will the tag be visible or not
	 */
	setTagVisibility(visible: boolean): void;

}

export default OutputStrategy;
