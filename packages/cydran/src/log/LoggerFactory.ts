import Logger from "log/Logger";
import LoggerImpl from "log/LoggerImpl";
import LoggerServiceImpl from "log/LoggerServiceImpl";
import { Properties } from "properties/Property";
import { isDefined, requireNotNull } from "util/Utils";
import Level from "log/Level";
import { OutputStrategy } from "log/OutputStrategy";
import LoggerService from "log/LoggerService";
import PropertiesImpl from 'properties/PropertiesImpl';

class LoggerFactory {

	private static loggerSvc: LoggerService;

	private static wkLog: Logger;

	private static initialized: boolean = false;

	// TODO - Remove the need for this method
	public static init(properties: Properties) {
		LoggerFactory.initialized = true;
		LoggerFactory.loggerSvc = new LoggerServiceImpl(properties);
		LoggerFactory.wkLog = LoggerFactory.getLogger(`LoggerFactory`);
	}

	/**
	 * Get the named {@link Logger | logger}
	 * @param name of the associated logger
	 * @param level to log at
	 * @returns a Logger reference
	 */
	public static getLogger(name: string, level?: string, strategy?: OutputStrategy): Logger {
		if (!LoggerFactory.initialized) {
			LoggerFactory.initialized = true;
			LoggerFactory.loggerSvc = new LoggerServiceImpl(new PropertiesImpl());
			LoggerFactory.wkLog = LoggerFactory.getLogger(`LoggerFactory`);
		}

		let wkStratId: string = null;

		if (isDefined(strategy)) {
			wkStratId = strategy.getId();
			this.registerOutputStrategy(strategy.getId(), strategy);
		}

		const retLogger: Logger = new LoggerImpl(requireNotNull(name, "name"), this.loggerSvc, wkStratId);

		if (isDefined(level)) {
			try {
				const wkLevel: Level = this.getLevelByName(level);
				// retLogger.setLevel(wkLevel);
			} catch (err) {
				retLogger.ifDebug(() => `Could not set level of "${ level }" for this new logger.`, err);
			}
		}

		return retLogger;
	}

	public static registerOutputStrategy(key: string, strat: OutputStrategy): void {
		try {
			this.loggerSvc.registerOutputStrategy(key, strat);
		} catch (err) {
			this.wkLog.ifError(() => err.message, err);
		}
	}

	public static removeOutputStrategy(key: string): void {
		try {
			this.loggerSvc.removeOutputStrategy(key);
		} catch (err) {
			this.wkLog.ifError(() => err.message, err);
		}
	}

	public static setPrefsForStrategy(key: string, props: Properties): void {
		this.loggerSvc.setPrefsForStrategy(key, props);
	}

	/**
	 * Set change/modify the log level during runtime.
	 * Any string not matching a valid level will cause an error message to be generated as long as logging isn't currently set above error
	 * Valid levels are: trace, debug, info, warn, error, fatal, disabled
	 * @param level NON-CASESENSITIVE string representation of a qualified level.
	 * @returns void
	 */
	public static updateLevel(level: string): void {
		this.loggerSvc.setLevelByName(level);
	}

	/**
	 * Get the current level as a string
	 * @returns string representation of the current logging level
	 */
	public static currentLevelAsString(): string {
		return this.loggerSvc.getLevelAsString();
	}

	/**
	 * Get the current level
	 * @returns representation of the current logging level
	 */
	public static currentLevel(): Level {
		return this.loggerSvc.getLevel();
	}

	/**
	 * Set the preferences for the logging service
	 * @param props
	 */
	public static setPreferences(props: Properties): void {
		this.loggerSvc.updateServicePrefs(props);
	}

	private static getLevelByName(name: string = "null"): Level {
		const newLevel: Level = Level[name.toUpperCase()];

		if (!isDefined(newLevel)) {
			this.wkLog.ifDebug(() => `"${ name.toUpperCase() }" not a valid logging level`);
		}

		return newLevel;
	}
}

export default LoggerFactory;
