import Logger from "./Logger";
import LoggerImpl from "./LoggerImpl";
import LoggerService from "./LoggerService";

class LoggerFactory {

	/**
	 * Get the named logger
	 * @param name of the associated logger
	 */
	public static getLogger(name: string): Logger {
		return new LoggerImpl(name, LoggerService.INSTANCE);
	}

}

export default LoggerFactory;
