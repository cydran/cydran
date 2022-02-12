import Level from "log/Level";
import Logger from "log/Logger";
import LoggerService from "log/LoggerService";
import { requireNotNull, isDefined, padText } from "util/Utils";

const LOGGER_NAME_LENGTH = 20;

class LoggerImpl implements Logger {
	private name: string;

	private loggerService: LoggerService;

	private level: Level;

	constructor(name: string, loggerService: LoggerService) {
		const wkName: string = requireNotNull(name, "name");
		this.name = (name.length < LOGGER_NAME_LENGTH) ? padText(wkName, LOGGER_NAME_LENGTH): wkName;
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
		if (isDefined(payloadFn) && this.isTrace()) {
			this.trace(payloadFn(), error);
		}
	}

	public debug(payload: any, error?: Error): void {
		this.loggerService.log(this, Level.DEBUG, payload, error);
	}

	public ifDebug(payloadFn: () => any, error?: Error): void {
		if (isDefined(payloadFn) && this.isDebug()) {
			this.debug(payloadFn(), error);
		}
	}

	public info(payload: any, error?: Error): void {
		this.loggerService.log(this, Level.INFO, payload, error);
	}

	public ifInfo(payloadFn: () => any, error?: Error): void {
		if (isDefined(payloadFn) && this.isInfo()) {
			this.info(payloadFn(), error);
		}
	}

	public warn(payload: any, error?: Error): void {
		this.loggerService.log(this, Level.WARN, payload, error);
	}

	public ifWarn(payloadFn: () => any, error?: Error): void {
		if (isDefined(payloadFn) && this.isWarn()) {
			this.warn(payloadFn(), error);
		}
	}

	public error(payload: any, error?: Error): void {
		this.loggerService.log(this, Level.ERROR, payload, error);
	}

	public ifError(payloadFn: () => any, error?: Error): void {
		if (isDefined(payloadFn) && this.isError()) {
			this.error(payloadFn(), error);
		}
	}

	public fatal(payload: any, error?: Error): void {
		this.loggerService.log(this, Level.FATAL, payload, error);
	}

	public ifFatal(payloadFn: () => any, error?: Error): void {
		if (isDefined(payloadFn) && this.isFatal()) {
			this.fatal(payloadFn(), error);
		}
	}

	public isTrace(): boolean {
		return this.willMeet(Level.TRACE);
	}

	public isDebug(): boolean {
		return this.willMeet(Level.DEBUG);
	}

	public isInfo(): boolean {
		return this.willMeet(Level.INFO);
	}

	public isWarn(): boolean {
		return this.willMeet(Level.WARN);
	}

	public isError(): boolean {
		return this.willMeet(Level.ERROR);
	}

	public isFatal(): boolean {
		return this.willMeet(Level.FATAL);
	}

	public isDisabled(): boolean {
		return this.willMeet(Level.DISABLED);
	}

	public getName(): string {
		return this.name;
	}

	protected willMeet(chkdLvl: Level): boolean  {
		return isDefined(this.level) ? (chkdLvl >= this.level) : this.loggerService.willMeet(chkdLvl);
	}

}

export default LoggerImpl;
