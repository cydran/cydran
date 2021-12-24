import Logger from "log/Logger";
import LoggerImpl from "log/LoggerImpl";
import LoggerServiceImpl from "log/LoggerServiceImpl";
import { Properties } from "properties/Property";

class LoggerFactory {
	/**
	 * Get the named logger
	 * @param name of the associated logger
	 */
	public static getLogger(name: string, props?: Properties): Logger {
		return new LoggerImpl(name, LoggerServiceImpl.INSTANCE(props));
	}
}

export default LoggerFactory;
