import Logger from "log/Logger";
import LoggerImpl from "log/LoggerImpl";
import LoggerServiceImpl from "log/LoggerServiceImpl";
import { Properties } from "properties/Property";
import { isDefined, requireNotNull } from "util/Utils";
import PropertiesImpl from "properties/PropertiesImpl";

class LoggerFactory {
	private static loggerSvc: LoggerServiceImpl;

	/**
	 * Get the named {@link Logger | logger}
	 * @param name of the associated logger
	 * @returns a Logger reference
	 */
	public static getLogger(name: string): Logger {
		this.guardService();
		return new LoggerImpl(requireNotNull(name, "name"), this.loggerSvc);
	}

	/**
	 * Set change/modify the log level during runtime.
	 * Any string not matching a valid level will cause an error message to be generated as long as logging isn't currently set above error
	 * Valid levels are: trace, debug, info, warn, error, fatal, disabled
	 * @param level NON-CASESENSITIVE string representation of a qualified level.
	 * @returns void
	 */
	public static updateLevel(level: string): void {
		this.guardService();
		this.loggerSvc.setLevelByName(level);
	}

	/**
	 * Get the current level as a string
	 * @returns string representation of the current logging level
	 */
	public static currentLevel(): string {
		this.guardService();
		return this.loggerSvc.getLevelAsString();
	}

	/**
	 * Set the preferences for the logging service
	 * @param props
	 */
	public static setPreferences(props: Properties): void {
		this.guardService();
		this.loggerSvc.setPreferences(props);
	}

	private static guardService(props: any = new PropertiesImpl()): void {
		if(!isDefined(this.loggerSvc)) {
			this.loggerSvc = new LoggerServiceImpl(props);
		}
	}
}

export default LoggerFactory;
