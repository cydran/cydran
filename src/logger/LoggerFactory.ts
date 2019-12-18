import Logger from "./Logger";
import LoggerImpl from "./LoggerImpl";
import LoggerServiceImpl from "./LoggerServiceImpl";

class LoggerFactory {

	/**
	 * Get the named logger
	 * @param name of the associated logger
	 */
	public static getLogger(name: string): Logger {
		return new LoggerImpl(name, LoggerServiceImpl.INSTANCE);
	}

}

export default LoggerFactory;
