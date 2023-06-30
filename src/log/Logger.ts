import LoggingOperations from 'log/LoggingOperations';

interface Logger extends LoggingOperations {

	/**
	 * Get the name of the logger
	 * @returns string
	 */
	getName(): string;

}

export default Logger;
