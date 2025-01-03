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
   * @param logName of the { Logger }
   * @param payload to be written out
   * @param params additional optional arguments
   */
  trace(payload: any, ...params: any): void;

  /**
   * Log payload at a "debug" level
   * @param logName of the { Logger }
   * @param payload to be written out
   * @param params additional optional arguments
   */
  debug(payload: any, ...params: any): void;

  /**
   * Log payload at a "info" level
   * @param logName of the { Logger }
   * @param payload to be written out
   * @param params additional optional arguments
   */
  info(payload: any, ...params: any): void;

  /**
   * Log payload at a "warn" level
   * @param logName of the { Logger }
   * @param payload to be written out
   * @param params additional optional arguments
   */
  warn(payload: any, ...params: any): void;

  /**
   * Log payload at a "error" level
   * @param logName of the { Logger }
   * @param payload to be written out
   * @param params additional optional arguments
   */
  error(payload: any, ...params: any): void;

  /**
   * Log payload at a "fatal" level
   * @param logName of the { Logger }
   * @param payload to be written out
   * @param params additional optional arguments
   */
  fatal(payload: any, ...params: any): void;

	/**
	 * Only if log at a "trace" level execute fn() to derive payload to log
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments
	 */
	ifTrace(payloadFn: () => any, ...params: any): void;

	/**
	 * Only if log at a "debug" level execute fn() to derive payload to log
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments
	 */
	ifDebug(payloadFn: () => any, ...params: any): void;

	/**
	 * Only if log at a "info" level execute fn() to derive payload to log
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments
	 */
	ifInfo(payloadFn: () => any, ...params: any): void;

	/**
	 * Only if log at a "warn" level execute fn() to derive payload to log
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments
	 */
	ifWarn(payloadFn: () => any, ...params: any): void;

	/**
	 * Only if log at a "error" level execute fn() to derive payload to log
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments
	 */
	ifError(payloadFn: () => any, ...params: any): void;

	/**
	 * Only if log at a "fatal" level execute fn() to derive payload to log
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments
	 */
	ifFatal(payloadFn: () => any, ...params: any): void;
}

export default Logger
