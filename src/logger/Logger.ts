interface Logger {

	getName(): string;

	trace(payload: any, error?: Error): void;

	debug(payload: any, error?: Error): void;

	info(payload: any, error?: Error): void;

	error(payload: any, error?: Error): void;

	fatal(payload: any, error?: Error): void;

}

export default Logger;