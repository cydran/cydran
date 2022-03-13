import Logger from "log/Logger";
import LoggerImpl from "log/LoggerImpl";
import LoggerServiceImpl from "log/LoggerServiceImpl";
import { Properties } from "properties/Property";
import { isDefined, requireNotNull } from "util/Utils";
import Level from "log/Level";
import OutputStrategy from "log/OutputStrategy";
import PropertiesImpl from "properties/PropertiesImpl";
import LoggerService from "log/LoggerService";
import LoggerFactory from "log/LoggerFactory";

class LoggerFactoryImpl implements LoggerFactory {
	private loggerSvc: LoggerService;
	private wkLog: Logger;

	constructor(props: any = {}) {
		const wkProps: Properties = new PropertiesImpl();
		(wkProps as PropertiesImpl).load(props);
		this.loggerSvc = new LoggerServiceImpl(wkProps);
		this.wkLog = this.getLogger("LoggerFactory");
	}

	/**
	 * Get the named {@link Logger | logger}
	 * @param name of the associated logger
	 * @param level to log at
	 * @returns a Logger reference
	 */
	public getLogger(name: string, level?: string, strategy?: OutputStrategy): Logger {
		let wkStratId: string = null;
		if(isDefined(strategy)) {
			wkStratId = strategy.getId();
			this.registerOutputStrategy(strategy.getId(), strategy);
		}
		const retLogger: Logger = new LoggerImpl(requireNotNull(name, "name"), this.loggerSvc, wkStratId);

		if (isDefined(level)) {
			try {
				const wkLevel: Level = this.getLevelByName(level);
				retLogger.setLevel(wkLevel);
			} catch (err) {
				retLogger.ifDebug(() => `Could not set level of "${ level }" for this new logger.`, err);
			}
		}
		return retLogger;
	}

	public registerOutputStrategy(key: string, strat: OutputStrategy): void {
		try {
			this.loggerSvc.registerOutputStrategy(key, strat);
		} catch (err) {
			this.wkLog.ifError(() => err.message, err);
		}
	}

	public removeOutputStrategy(key: string): void {
		try {
			this.loggerSvc.removeOutputStrategy(key);
		} catch (err) {
			this.wkLog.ifError(() => err.message, err);
		}
	}

	public setPrefsForStrategy(key: string, props: Properties): void {
		this.loggerSvc.setPrefsForStrategy(key, props);
	}

	/**
	 * Set change/modify the log level during runtime.
	 * Any string not matching a valid level will cause an error message to be generated as long as logging isn't currently set above error
	 * Valid levels are: trace, debug, info, warn, error, fatal, disabled
	 * @param level NON-CASESENSITIVE string representation of a qualified level.
	 * @returns void
	 */
	public updateLevel(level: string): void {
		this.loggerSvc.setLevelByName(level);
	}

	/**
	 * Get the current level as a string
	 * @returns string representation of the current logging level
	 */
	public currentLevelAsString(): string {
		return this.loggerSvc.getLevelAsString();
	}

	/**
	 * Get the current level
	 * @returns representation of the current logging level
	 */
	public currentLevel(): Level {
		return this.loggerSvc.getLevel();
	}

	/**
	 * Set the preferences for the logging service
	 * @param props
	 */
	public setPreferences(props: Properties): void {
		this.loggerSvc.updateServicePrefs(props);
	}

	private getLevelByName(name: string = "null"): Level {
		const newLevel: Level = Level[name.toUpperCase()];
		if (!isDefined(newLevel)) {
			this.wkLog.ifDebug(() => `"${ name.toUpperCase() }" not a valid logging level`);
		}
		return newLevel;
	}
}

export default LoggerFactoryImpl;
