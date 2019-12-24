import Logger from "@/logger/Logger";
import LoggerImpl from "@/logger/LoggerImpl";
import LoggerServiceImpl from "@/logger/LoggerServiceImpl";

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
