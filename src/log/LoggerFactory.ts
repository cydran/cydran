import Logger from "log/Logger";
import { Properties } from "properties/Property";
import Level from "log/Level";
import OutputStrategy from "log/OutputStrategy";

interface LoggerFactory {

	/**
	 * Get the named {@link Logger | logger}
	 * @param name of the associated logger
	 * @param level to log at
	 * @returns a Logger reference
	 */
	getLogger(name: string, level?: string, strategy?: OutputStrategy): Logger;

	registerOutputStrategy(key: string, strat: OutputStrategy): void;

	removeOutputStrategy(key: string): void;

	setPrefsForStrategy(key: string, props: Properties): void;

	/**
	 * Set change/modify the log level during runtime.
	 * Any string not matching a valid level will cause an error message to be generated as long as logging isn't currently set above error
	 * Valid levels are: trace, debug, info, warn, error, fatal, disabled
	 * @param level NON-CASESENSITIVE string representation of a qualified level.
	 * @returns void
	 */
	updateLevel(level: string): void;

	/**
	 * Get the current level as a string
	 * @returns string representation of the current logging level
	 */
	currentLevelAsString(): string;

	/**
	 * Get the current level
	 * @returns representation of the current logging level
	 */
	currentLevel(): Level;

	/**
	 * Set the preferences for the logging service
	 * @param props
	 */
	setPreferences(props: Properties): void;

}

export default LoggerFactory;
