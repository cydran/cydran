import Level from "@/log/Level";
import Logger from "@/log/Logger";
import LoggerService from "@/log/LoggerService";
import OutputStrategy from "@/log/OutputStrategy";
import { requireNotNull } from "@/Utils";

class ConsoleOutputStrategy implements OutputStrategy {

	private static getNow(): string {
		const now = new Date();

		return `${now.getUTCFullYear()
			}-${now.getUTCMonth()
			}:${now.getUTCDate()
			}:${now.getUTCHours()
			}:${now.getUTCMinutes()
			}:${now.getUTCSeconds()
			}:${now.getUTCMilliseconds()
			}`;
	}

	public log(logName: string, level: Level, payload: any, stacked?: Error | boolean): void {
		if (level === Level.DISABLED) {
			return;
		}

		const preamble: string = `${ConsoleOutputStrategy.getNow()} ${level} [${logName}]`;
		const shortArgs: boolean = payload instanceof Error;
		const printFullStack: boolean = !(stacked instanceof Error) ? (null !== stacked ? stacked : false) : false;

		if (level >= Level.WARN) {
			const logMsg: string = (shortArgs ? payload.stack : payload);
			const errMsg: string = (stacked instanceof Error) ? stacked.stack : "";
			const secondPreamble = (shortArgs ? "" : ((stacked) ? " - %s" : ""));

			switch (level) {
				case Level.WARN:
					// tslint:disable-next-line
					console.log(`%c${preamble + secondPreamble} ${logMsg}`, 'color:#ff9400;');
					break;

				case Level.ERROR:
				case Level.FATAL:
				default:
					// tslint:disable-next-line
					console.error(preamble + secondPreamble, logMsg, errMsg);
					break;
			}
		} else {
			let color: string = null;
			switch (level) {
				case Level.TRACE:
					color = (printFullStack) ? "#00752d" : "#ff9400";
					break;
				case Level.DEBUG:
					color = "#00752d";
					break;
				case Level.INFO:
					color = "#2d57ca";
					break;
			}
			if (color) {
				// tslint:disable-next-line
				console.log(`%c${preamble}`, `color:${color}`, payload);
			} else {
				// tslint:disable-next-line
				console.log(preamble, payload);
			}
		}
	}

}

const DIGITS: RegExp = /\d+/;

class LevelUtils {

	public static valueOf(level: string): Level {
		return Level[level];
	}

	public static stringValueOf(level: Level): string {
		return Level[level];
	}

	public static getKeys(): String[] {
		const keys: String[] = [];

		for (const key of Object.keys(Level)) {
			if (DIGITS.test(key)) {
				keys[key] = this.stringValueOf(Number.parseInt(key, 10));
			}
		}

		return keys;
	}

	public static values(): Level[] {
		return this.getKeys().map((key: string) => {
			return Level[key];
		});
	}

	public static size(): number {
		return this.getKeys().length;
	}

}

class LoggerFactory {

	/**
	 * Get the named logger
	 * @param name of the associated logger
	 */
	public static getLogger(name: string): Logger {
		return new LoggerImpl(name, LoggerServiceImpl.INSTANCE);
	}

}

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

class LoggerServiceImpl implements LoggerService {

	public static INSTANCE: LoggerServiceImpl = new LoggerServiceImpl();

	private level: Level;

	private outputStrategy: OutputStrategy;

	constructor() {
		this.level = Level.INFO;
		this.outputStrategy = new ConsoleOutputStrategy();
	}

	public log(logger: Logger, level: Level, payload: any, errorStack?: Error | boolean): void {
		if (level >= this.level && level !== Level.DISABLED) {
			this.outputStrategy.log(logger.getName(), level, payload, errorStack);
		}
	}

	public setLevel(level: Level): void {
		this.level = level;
	}

	public isTrace(): boolean {
		return (Level.TRACE >= this.level);
	}

	public isDebug(): boolean {
		return (Level.DEBUG >= this.level);
	}

	public isInfo(): boolean {
		return (Level.INFO >= this.level);
	}

	public isWarn(): boolean {
		return (Level.WARN >= this.level);
	}

	public isError(): boolean {
		return (Level.ERROR >= this.level);
	}

	public isFatal(): boolean {
		return (Level.FATAL >= this.level);
	}

	public isDisabled(): boolean {
		return (Level.DISABLED >= this.level);
	}

}

export { ConsoleOutputStrategy, LevelUtils, LoggerFactory, LoggerImpl, LoggerServiceImpl };
