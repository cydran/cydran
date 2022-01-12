import Logger from "log/Logger";
import LoggerImpl from "log/LoggerImpl";
import LoggerServiceImpl from "log/LoggerServiceImpl";
import { Properties } from "properties/Property";

class LoggerFactory {
	/**
	 * Get the named {@link Logger | logger}
	 * @param name of the associated logger
	 * @returns a Logger reference
	 */
	public static getLogger(name: string, props?: Properties): Logger {
		return new LoggerImpl(name, LoggerServiceImpl.INSTANCE(props));
	}

	/**
	 * Set change/modify the log {@link Level | level} during runtime. Any string not matching a valid level will cause an error message to be generated as long as logging isn't currently {@link Level#DISABLED | disabled}
	 * @param level non-casesensitive string representation of {@link Level | a qualified level}.
	 * @returns void
	 */
	public static updateLogLevel(level: string): void {
		LoggerServiceImpl.INSTANCE().setLevelByName(level);
	}
}

export default LoggerFactory;
