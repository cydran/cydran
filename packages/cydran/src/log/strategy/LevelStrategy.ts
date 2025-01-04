import { Appender } from "log/appender/Appender";
import { IflevelStrategy } from "log/strategy/IfLevelStrategy";
import { IsLevelType } from "log/strategy/IsLevelType";

export interface LevelStrategy extends IflevelStrategy, IsLevelType {

	/**
	 * Log composited message at a "trace" level
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param msgBase to be written out
	 * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	trace(logName: string, pender: Appender, msgBase: string, ...params: any): void;

	/**
	 * Log composited message at a "debug" level
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param msgBase to be written out
	 * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	debug(logName: string, pender: Appender, msgBase: string, ...params: any): void;

	/**
	 * Log composited message at a "info" level
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param msgBase to be written out
	 * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	info(logName: string, pender: Appender, msgBase: string, ...params: any): void;

	/**
	 * Log composited message at a "warn" level
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param msgBase to be written out
	 * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	warn(logName: string, pender: Appender, msgBase: string, ...params: any): void;

	/**
	 * Log composited message at a "error" level
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param msgBase to be written out
	 * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	error(logName: string, pender: Appender, msgBase: string, ...params: any): void;

	/**
	 * Log composited message at a "fatal" level
	 * @param logName of the { Logger }
	 * @param pender the {Appender} to write to
	 * @param msgBase to be written out
	 * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	fatal(logName: string, pender: Appender, msgBase: string, ...params: any): void;

  /**
   * Get the current {Level level} for this logger
   * @returns a {Level} object
   */
  getLevel(): string;

}

