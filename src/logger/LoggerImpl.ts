import Level from "./Level";
import Logger from "./Logger";
import LoggerService from "./LoggerService";

const LOGGER_NAME_LENGTH = 20;

class LoggerImpl implements Logger {

	private name: string;

	private loggerService: LoggerService;

	constructor(name: string, loggerService: LoggerService) {
		if (name.length < LOGGER_NAME_LENGTH) {
			let count: number = LOGGER_NAME_LENGTH - name.length;

			while (count > 0) {
				name = name + " ";
				--count;
			}
		}

		this.name = name;
		this.loggerService = loggerService;
	}

	public trace(payload: any, error?: Error): void {
		this.loggerService.log(this, Level.TRACE, payload, error);
	}

	public debug(payload: any, error?: Error): void {
		this.loggerService.log(this, Level.DEBUG, payload, error);
	}

	public info(payload: any, error?: Error): void {
		this.loggerService.log(this, Level.INFO, payload, error);
	}

	public error(payload: any, error?: Error): void {
		this.loggerService.log(this, Level.ERROR, payload, error);
	}

	public fatal(payload: any, error?: Error): void {
		this.loggerService.log(this, Level.FATAL, payload, error);
	}

	public isTrace(): boolean {
		return this.loggerService.isTrace();
	}

	public isDebug(): boolean {
		return this.loggerService.isDebug();
	}

	public isInfo(): boolean {
		return this.loggerService.isInfo();
	}

	public isError(): boolean {
		return this.loggerService.isError();
	}

	public isFatal(): boolean {
		return this.loggerService.isFatal();
	}

	public isDisable(): boolean {
		return this.loggerService.isDisable();
	}

	public getName(): string {
		return this.name;
	}

}

export default LoggerImpl;
