import Level from "log/Level";
import Logger from "log/Logger";
import LoggerService from "log/LoggerService";
import { requireNotNull, isDefined } from "util/Utils";

const LOGGER_NAME_LENGTH = 20;

class LoggerImpl implements Logger {
	private name: string;

	private loggerService: LoggerService;

	private level: Level;

	constructor(name: string, loggerService: LoggerService) {
		const wkName: string = requireNotNull(name, "name");
		this.name = (name.length < LOGGER_NAME_LENGTH) ? bufferText(wkName, LOGGER_NAME_LENGTH): wkName;
		this.loggerService = loggerService;
	}

	public setLevel(level: Level) {
		this.level = level;
		this.loggerService.log(this, Level.DEBUG, `Log level set @ "${ Level[this.level] }" for "${ this.name.trim() }" logger`, null);
	}

	public getLevel(): Level {
		return this.level;
	}

	public trace(payload: any, error?: Error): void {
		this.loggerService.log(this, Level.TRACE, payload, error);
	}

	public ifTrace(payloadFn: () => any, error?: Error): void {
		if (payloadFn !== null && this.isTrace()) {
			this.trace(payloadFn(), error);
		}
	}

	public debug(payload: any, error?: Error): void {
		this.loggerService.log(this, Level.DEBUG, payload, error);
	}

	public ifDebug(payloadFn: () => any, error?: Error): void {
		if (payloadFn !== null && this.isDebug()) {
			this.debug(payloadFn(), error);
		}
	}

	public info(payload: any, error?: Error): void {
		this.loggerService.log(this, Level.INFO, payload, error);
	}

	public ifInfo(payloadFn: () => any, error?: Error): void {
		if (payloadFn !== null && this.isInfo()) {
			this.info(payloadFn(), error);
		}
	}

	public warn(payload: any, error?: Error): void {
		this.loggerService.log(this, Level.WARN, payload, error);
	}

	public ifWarn(payloadFn: () => any, error?: Error): void {
		if (payloadFn !== null && this.isWarn()) {
			this.warn(payloadFn(), error);
		}
	}

	public error(payload: any, error?: Error): void {
		this.loggerService.log(this, Level.ERROR, payload, error);
	}

	public ifError(payloadFn: () => any, error?: Error): void {
		if (payloadFn !== null && this.isError()) {
			this.error(payloadFn(), error);
		}
	}

	public fatal(payload: any, error?: Error): void {
		this.loggerService.log(this, Level.FATAL, payload, error);
	}

	public ifFatal(payloadFn: () => any, error?: Error): void {
		if (payloadFn !== null && this.isFatal()) {
			this.fatal(payloadFn(), error);
		}
	}

	public isTrace(): boolean {
		return this.isLevel(Level.TRACE);
	}

	public isDebug(): boolean {
		return this.isLevel(Level.DEBUG);
	}

	public isInfo(): boolean {
		return this.isLevel(Level.INFO);
	}

	public isWarn(): boolean {
		return this.isLevel(Level.WARN);
	}

	public isError(): boolean {
		return this.isLevel(Level.ERROR);
	}

	public isFatal(): boolean {
		return this.isLevel(Level.FATAL);
	}

	public isDisabled(): boolean {
		return this.isLevel(Level.DISABLED);
	}

	public getName(): string {
		return this.name;
	}

	private isLevel(level: Level): boolean  {
		let retval: boolean = false;
		if(isDefined(this.level)) {
			retval = level >= this.level;
		} else {
			switch(level) {
				case Level.TRACE:
					retval = this.loggerService.isTrace();
					break;
				case Level.DEBUG:
					retval = this.loggerService.isDebug();
					break;
				case Level.INFO:
					retval = this.loggerService.isInfo();
					break;
				case Level.WARN:
					retval = this.loggerService.isWarn();
					break;
				case Level.ERROR:
					retval = this.loggerService.isError();
					break;
				case Level.FATAL:
					retval = this.loggerService.isFatal();
					break;
				case Level.DISABLED:
					retval = this.loggerService.isDisabled();
					break;
				default:
					break;
			}
		}
		return retval;
	}

}

export default LoggerImpl;
