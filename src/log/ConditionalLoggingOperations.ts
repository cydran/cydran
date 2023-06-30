interface ConditionalLoggingOperations {

	/**
	 * Only if log at a "trace" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param error optional if there is an error object with detail data
	 */
	ifTrace(payloadFn: () => any, error?: Error): void;

	/**
	 * Only if log at a "debug" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param error optional if there is an error object with detail data
	 */
	ifDebug(payloadFn: () => any, error?: Error): void;

	/**
	 * Only if log at a "info" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param error optional if there is an error object with detail data
	 */
	ifInfo(payloadFn: () => any, error?: Error): void;

	/**
	 * Only if log at a "warn" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param error optional if there is an error object with detail data
	 */
	ifWarn(payloadFn: () => any, error?: Error): void;

	/**
	 * Only if log at a "error" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param error optional if there is an error object with detail data
	 */
	ifError(payloadFn: () => any, error?: Error): void;

	/**
	 * Only if log at a "fatal" level execute fn() to derive payload to log
	 * @param payloadFn to be written out
	 * @param error optional if there is an error object with detail data
	 */
	ifFatal(payloadFn: () => any, error?: Error): void;

}

export default ConditionalLoggingOperations;
