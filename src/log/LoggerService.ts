import Logger from "log/Logger";
import Level from "log/Level";
import OutputStrategy from "log/OutputStrategy";
import { Properties } from "properties/Property";

interface LoggerService {

	/**
	 * Logging method
	 *
	 * @param logger - implementation logger object
	 * @param level - log level of statement or object to log
	 * @param payload - statement or object to log
	 * @param errorStack - optional boolean or Error object
	 * @param stratKeys - key of output strategy to use for logging
	 */
	log(logger: Logger, level: Level, payload: any, errorStack?: Error | boolean, stratKey?: string): void;

	/**
	 * Update the properties for the {LoggerService}
	 * @param props - Cydran {Properties properties} object containing preferences
	 */
	updateServicePrefs(props: Properties): void;

	/**
	 * Get the general Cydran system runtime log {Level level}
	 * @returns {Level} object
	 */
	 getLevel(): Level;

	/**
	 * Set the general log {Level level} by name
	 * @param level - consisting of one of the following: "TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL", "DISABLED" - any other value will be rejected
	 */
	setLevelByName(level: string): void;

	/**
	 * Set the general log level with a Cydran {Level} object
	 * @param level - Cydran {Level} object
	 */
	setLevel(level: Level): void;

	/**
	 * Will the supplied argument meet the general Cydran log level
	 * @param level - Cydran {Level} object
	 */
	willMeet(level: Level): boolean;

	/**
	 * Register and { OutputStrategy } with the logging service
	 * @param key - registration key value
	 * @param strat - {OutputStrategy} to be utilized
	 */
	registerOutputStrategy(key: string, strat: OutputStrategy): void;

	/**
	 * Remove the indicated {OutputStrategy} from the logging service
	 * @param key - registration key value
	 */
	removeOutputStrategy(key: string): void;

	/**
	 * Set the preferences for the indicated {OutputStrategy}
	 * @param key - registration key value
	 * @param props - preferences object
	 */
	setPrefsForStrategy(key: string, props: Properties): void;
}

export default LoggerService;
