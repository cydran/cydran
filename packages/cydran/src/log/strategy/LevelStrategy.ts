import { Appender } from "log/appender/Appender";
import { IflevelStrategy } from "log/strategy/IfLevelStrategy";
import { IsLevelType } from "log/strategy/IsLevelType";

export interface LevelStrategy extends IflevelStrategy, IsLevelType {

	/**
	 * Log payload at a "trace" level
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param payload to be written out
	 * @param params additional optional arguments
	 */
	trace(logName: string, pender: Appender, payload: any, ...params: any): void;

	/**
	 * Log payload at a "debug" level
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param payload to be written out
	 * @param params additional optional arguments
	 */
	debug(logName: string, pender: Appender, payload: any, ...params: any): void;

	/**
	 * Log payload at a "info" level
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param payload to be written out
	 * @param params additional optional arguments
	 */
	info(logName: string, pender: Appender, payload: any, ...params: any): void;

	/**
	 * Log payload at a "warn" level
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param payload to be written out
	 * @param params additional optional arguments
	 */
	warn(logName: string, pender: Appender, payload: any, ...params: any): void;

	/**
	 * Log payload at a "error" level
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param payload to be written out
	 * @param params additional optional arguments
	 */
	error(logName: string, pender: Appender, payload: any, ...params: any): void;

	/**
	 * Log payload at a "fatal" level
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param payload to be written out
	 * @param params additional optional arguments
	 */
	fatal(logName: string, pender: Appender, payload: any, ...params: any): void;

  /**
   * Get the current {Level level} for this logger
   * @returns a {Level} object
   */
  getLevel(): string;

}

