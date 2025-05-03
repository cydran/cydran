import { IsLevelType } from 'log/strategy/IsLevelType';

interface Logger extends IsLevelType {
  /**
   * Get the structured key name of the logger.
   * @returns string
   */
  getKey(): string;

  /**
   * Get human readable label for the logger.
   * @returns string
   */
  getLabel(): string;

  /**
   * Log payload at a "trace" level
   * @param primaryMsg to be written out
   * @param moreArgs additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
   */
  trace(primaryMsg: string, ...moreArgs: unknown[]): void;

  /**
   * Log payload at a "debug" level
   * @param primaryMsg to be written out
   * @param moreArgs additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
   */
  debug(primaryMsg: string, ...moreArgs: unknown[]): void;

  /**
   * Log payload at a "info" level
   * @param primaryMsg to be written out
   * @param moreArgs additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
   */
  info(primaryMsg: string, ...moreArgs: unknown[]): void;

  /**
   * Log payload at a "warn" level
   * @param primaryMsg to be written out
   * @param moreArgs additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
   */
  warn(primaryMsg: string, ...moreArgs: unknown[]): void;

  /**
   * Log payload at a "error" level
   * @param primaryMsg to be written out
   * @param moreArgs additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
   */
  error(primaryMsg: string, ...moreArgs: unknown[]): void;

  /**
   * Log payload at a "fatal" level
   * @param primaryMsg to be written out
   * @param moreArgs additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
   */
  fatal(primaryMsg: string, ...moreArgs: unknown[]): void;

	/**
	 * Only if log at a "trace" level execute fn() to derive payload to log
	 * @param primaryMsgFn result of to be written out
	 * @param moreArgs additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	ifTrace(primaryMsgFn: () => string, ...moreArgs: unknown[]): void;

	/**
	 * Only if log at a "debug" level execute fn() to derive payload to log
	 * @param primaryMsgFn result of to be written out
	 * @param moreArgs additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	ifDebug(primaryMsgFn: () => string, ...moreArgs: unknown[]): void;

	/**
	 * Only if log at a "info" level execute fn() to derive payload to log
	 * @param primaryMsgFn result of to be written out
	 * @param moreArgs additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	ifInfo(primaryMsgFn: () => string, ...moreArgs: unknown[]): void;

	/**
	 * Only if log at a "warn" level execute fn() to derive payload to log
	 * @param primaryMsgFn result of to be written out
	 * @param moreArgs additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	ifWarn(primaryMsgFn: () => string, ...moreArgs: unknown[]): void;

	/**
	 * Only if log at a "error" level execute fn() to derive payload to log
	 * @param primaryMsgFn result of to be written out
	 * @param moreArgs additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	ifError(primaryMsgFn: () => string, ...moreArgs: unknown[]): void;

	/**
	 * Only if log at a "fatal" level execute fn() to derive payload to log
	 * @param primaryMsgFn result of to be written out
	 * @param moreArgs additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	ifFatal(primaryMsgFn: () => string, ...moreArgs: unknown[]): void;
}

export default Logger
