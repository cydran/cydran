import Level from "./Level";
import Logger from "./Logger";

interface OutputStrategy {
	/**
	 * Log the message
	 * @param log {Logger} to be used
	 * @param level {Level} of message
	 * @param payload message/object to be logged
	 * @param error optional object or boolean to indicate +/- on whether or not to log the stack/message
	 */
	log(logger: Logger, level: Level, payload: any, errorStack?: Error | boolean): void;

}

export default OutputStrategy;
