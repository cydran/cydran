import { OutputStrategy } from 'log/strategy/OutputStrategy';

interface LoggerStrategy {

	/**
	 * Only if log at a "trace" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param error optional if there is an error object with detail data
	 */
	ifTrace(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void;

	/**
	 * Only if log at a "debug" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param error optional if there is an error object with detail data
	 */
	ifDebug(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void;

	/**
	 * Only if log at a "info" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param error optional if there is an error object with detail data
	 */
	ifInfo(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void;

	/**
	 * Only if log at a "warn" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param error optional if there is an error object with detail data
	 */
	ifWarn(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void;

	/**
	 * Only if log at a "error" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param error optional if there is an error object with detail data
	 */
	ifError(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void;

	/**
	 * Only if log at a "fatal" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param error optional if there is an error object with detail data
	 */
	ifFatal(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void;

	/**
	 * Is the log level at least at "trace" level
	 * @returns boolean
	 */
	isTrace(): boolean;

	/**
	 * Is the log level at least at "debug" level
	 * @returns boolean
	 */
	isDebug(): boolean;

	/**
	 * Is the log level at least at "info" level
	 * @returns boolean
	 */
	isInfo(): boolean;

	/**
	 * Is the log level at least at "warn" level
	 * @returns boolean
	 */
	isWarn(): boolean;

	/**
	 * Is the log level at least at "error" level
	 * @returns boolean
	 */
	isError(): boolean;

	/**
	 * Is the log level at least at "fatal" level
	 * @returns boolean
	 */
	isFatal(): boolean;

	/**
	 * Get the current {Level level} for this logger
	 * @returns a {Level} object
	 */
	getLevel(): string;

	/**
	 * Log payload at a "trace" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with detail data
	 */
	trace(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void;

	/**
	 * Log payload at a "debug" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with detail data
	 */
	debug(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void;

	/**
	 * Log payload at a "info" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with detail data
	 */
	info(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void;

	/**
	 * Log payload at a "warn" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with detail data
	 */
	warn(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void;

	/**
	 * Log payload at a "error" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with detail data
	 */
	error(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void;

	/**
	 * Log payload at a "fatal" level
	 * @param payload to be written out
	 * @param error optional if there is an error object with detail data
	 */
	fatal(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void;

}

export default LoggerStrategy;
