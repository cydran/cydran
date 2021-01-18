import Logger from "log/Logger";
import LoggerImpl from "log/LoggerImpl";
import LoggerServiceImpl from "log/LoggerServiceImpl";

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