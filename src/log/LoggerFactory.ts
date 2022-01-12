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
	 * Set change/modify the log level during runtime.
	 * Any string not matching a valid level will cause an error message to be generated as long as logging isn't currently set above error
	 * Valid levels are: trace, debug, info, warn, error, fatal, disabled
	 * @param level NON-CASESENSITIVE string representation of a qualified level.
	 * @returns void
	 */
	public static updateLevel(level: string): void {
		LoggerServiceImpl.INSTANCE().setLevelByName(level);
	}

	/**
	 * Get the current level as a string
	 * @returns string representation of the current logging level
	 */
	public static currentLevel(): string {
		return LoggerServiceImpl.INSTANCE().getLevelAsString();
	}
}

export default LoggerFactory;
