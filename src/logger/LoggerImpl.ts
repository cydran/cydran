import Level from "@/logger/Level";
import Logger from "@/logger/Logger";
import LoggerService from "@/logger/LoggerService";
import ObjectUtils from "@/ObjectUtils";

const requireNotNull = ObjectUtils.requireNotNull;

const LOGGER_NAME_LENGTH = 20;

class LoggerImpl implements Logger {

	private name: string;

	private loggerService: LoggerService;

	constructor(name: string, loggerService: LoggerService) {
		requireNotNull(name, "name");

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
		return this.loggerService.isTrace();
	}

	public isDebug(): boolean {
		return this.loggerService.isDebug();
	}

	public isInfo(): boolean {
		return this.loggerService.isInfo();
	}

	public isWarn(): boolean {
		return this.loggerService.isWarn();
	}

	public isError(): boolean {
		return this.loggerService.isError();
	}

	public isFatal(): boolean {
		return this.loggerService.isFatal();
	}

	public isDisabled(): boolean {
		return this.loggerService.isDisabled();
	}

	public getName(): string {
		return this.name;
	}

}

export default LoggerImpl;
