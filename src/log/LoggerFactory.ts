import Logger from "log/Logger";
import LoggerImpl from "log/LoggerImpl";
import LoggerServiceImpl from "log/LoggerServiceImpl";
import { Properties } from "properties/Property";
import { isDefined, requireNotNull } from "util/Utils";
import Level from "log/Level";
import OutputStrategy from "log/OutputStrategy";

class LoggerFactory {
	private static loggerSvc: LoggerServiceImpl;
	private static wkLog: Logger;

	/**
	 * Get the named {@link Logger | logger}
	 * @param name of the associated logger
	 * @param level to log at
	 * @returns a Logger reference
	 */
	public static getLogger(name: string, level?: string, strategy: OutputStrategy = null): Logger {
		const retLogger: Logger = new LoggerImpl(requireNotNull(name, "name"), this.guardService(), strategy);

		if (isDefined(level)) {
			try {
				const wkLevel: Level = LoggerFactory.getLevelByName(level);
				retLogger.setLevel(wkLevel);
			} catch (err) {
				retLogger.ifDebug(() => `Could not set level of "${ level }" for this new logger.`, err);
			}
		}
		return retLogger;
	}

	public static registerOutputStrategy(key: string, strat: OutputStrategy): void {
		try {
			this.guardService().registerOutputStrategy(key, strat);
		} catch (err) {
			this.wkLog.ifError(() => err.message, err);
		}
	}

	public static removeOutputStrategy(key: string): void {
		try {
			this.guardService().removeOutputStrategy(key);
		} catch (err) {
			this.wkLog.ifError(() => err.message, err);
		}
	}

	public static setPrefsForStrategy(key: string, props: Properties): void {
		this.guardService().setPrefsForStrategy(key, props);
	}

	/**
	 * Set change/modify the log level during runtime.
	 * Any string not matching a valid level will cause an error message to be generated as long as logging isn't currently set above error
	 * Valid levels are: trace, debug, info, warn, error, fatal, disabled
	 * @param level NON-CASESENSITIVE string representation of a qualified level.
	 * @returns void
	 */
	public static updateLevel(level: string): void {
		this.guardService().setLevelByName(level);
	}

	/**
	 * Get the current level as a string
	 * @returns string representation of the current logging level
	 */
	public static currentLevel(): string {
		return this.guardService().getLevelAsString();
	}

	/**
	 * Set the preferences for the logging service
	 * @param props
	 */
	public static setPreferences(props: Properties): void {
		this.guardService().updateServicePrefs(props);
	}

	private static getLevelByName(name: string = "null"): Level {
		const newLevel: Level = Level[name.toUpperCase()];
		if (!isDefined(newLevel)) {
			this.wkLog.ifDebug(() => `"${ name.toUpperCase() }" not a valid logging level`);
		}
		return newLevel;
	}

	private static guardService(props?: Properties): LoggerServiceImpl {
		if (!isDefined(this.loggerSvc)) {
			this.loggerSvc = new LoggerServiceImpl(props);
			this.wkLog = new LoggerImpl("LoggerFactory", this.loggerSvc);
		}
		return this.loggerSvc;
	}
}

export default LoggerFactory;
