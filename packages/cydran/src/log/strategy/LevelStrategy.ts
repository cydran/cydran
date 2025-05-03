import { Appender } from "log/appender/Appender";
import { IflevelStrategy } from "log/strategy/IfLevelStrategy";
import { IsLevelType } from "log/strategy/IsLevelType";

export interface LevelStrategy extends IflevelStrategy, IsLevelType {

	/**
	 * Log composited message at a "trace" level
	 * @param logLabel of the { Logger }
	 * @param appender the {Appender} instances to write to
	 * @param msgBase to be written out
	 * @param moreArgs additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	trace(logLabel: string, appenders: Appender[], msgBase: string, ...moreArgs: unknown[]): void;

	/**
	 * Log composited message at a "debug" level
	 * @param logLabel of the { Logger }
	 * @param appender the {Appender} instances to write to
	 * @param msgBase to be written out
	 * @param moreArgs additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	debug(logLabel: string, appenders: Appender[], msgBase: string, ...moreArgs: unknown[]): void;

	/**
	 * Log composited message at a "info" level
	 * @param logLabel of the { Logger }
	 * @param appender the {Appender} instances to write to
	 * @param msgBase to be written out
	 * @param moreArgs additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	info(logLabel: string, appenders: Appender[], msgBase: string, ...moreArgs: unknown[]): void;

	/**
	 * Log composited message at a "warn" level
	 * @param logLabel of the { Logger }
	 * @param appender the {Appender} instances to write to
	 * @param msgBase to be written out
	 * @param moreArgs additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	warn(logLabel: string, appenders: Appender[], msgBase: string, ...moreArgs: unknown[]): void;

	/**
	 * Log composited message at a "error" level
	 * @param logLabel of the { Logger }
	 * @param appender the {Appender} instances to write to
	 * @param msgBase to be written out
	 * @param moreArgs additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	error(logLabel: string, appenders: Appender[], msgBase: string, ...moreArgs: unknown[]): void;

	/**
	 * Log composited message at a "fatal" level
	 * @param logLabel of the { Logger }
	 * @param appender the {Appender} instances to write to
	 * @param msgBase to be written out
	 * @param moreArgs additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	fatal(logLabel: string, appenders: Appender[], msgBase: string, ...moreArgs: unknown[]): void;

  /**
   * Get the current {Level level} for this logger
   * @returns a {Level} object
   */
  getLevel(): string;

}

