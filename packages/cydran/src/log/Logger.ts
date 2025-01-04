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
   * @param payload to be written out
   * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
   */
  trace(payload: any, ...params: any): void;

  /**
   * Log payload at a "debug" level
   * @param payload to be written out
   * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
   */
  debug(payload: any, ...params: any): void;

  /**
   * Log payload at a "info" level
   * @param payload to be written out
   * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
   */
  info(payload: any, ...params: any): void;

  /**
   * Log payload at a "warn" level
   * @param payload to be written out
   * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
   */
  warn(payload: any, ...params: any): void;

  /**
   * Log payload at a "error" level
   * @param payload to be written out
   * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
   */
  error(payload: any, ...params: any): void;

  /**
   * Log payload at a "fatal" level
   * @param payload to be written out
   * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
   */
  fatal(payload: any, ...params: any): void;

	/**
	 * Only if log at a "trace" level execute fn() to derive payload to log
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	ifTrace(payloadFn: () => any, ...params: any): void;

	/**
	 * Only if log at a "debug" level execute fn() to derive payload to log
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	ifDebug(payloadFn: () => any, ...params: any): void;

	/**
	 * Only if log at a "info" level execute fn() to derive payload to log
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	ifInfo(payloadFn: () => any, ...params: any): void;

	/**
	 * Only if log at a "warn" level execute fn() to derive payload to log
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	ifWarn(payloadFn: () => any, ...params: any): void;

	/**
	 * Only if log at a "error" level execute fn() to derive payload to log
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	ifError(payloadFn: () => any, ...params: any): void;

	/**
	 * Only if log at a "fatal" level execute fn() to derive payload to log
	 * @param payloadFn result of to be written out
	 * @param params additional optional arguments; the last argument as an Error is assumed to be required for the stack ouptut regardless of log level
	 */
	ifFatal(payloadFn: () => any, ...params: any): void;
}

export default Logger
