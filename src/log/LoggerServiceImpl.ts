import Level from "log/Level";
import Logger from "log/Logger";
import LoggerService from "log/LoggerService";
import OutputStrategy from "log/OutputStrategy";
import ConsoleOutputStrategy from "log/ConsoleOutputStrategy";
import { isDefined } from "util/Utils";

class LoggerServiceImpl implements LoggerService {
	private static instance: LoggerServiceImpl;

	public static INSTANCE = (): LoggerServiceImpl => {
		if(!LoggerServiceImpl.instance) {
			LoggerServiceImpl.instance = new LoggerServiceImpl();
		}
		return LoggerServiceImpl.instance;
	}

	private level: Level;

	private outputStrategy: OutputStrategy;

	private constructor() {
		this.level = Level.INFO;
		this.outputStrategy = new ConsoleOutputStrategy();
	}

	public log(logger: Logger, level: Level, payload: any, errorStack?: Error | boolean): void {
		if (level >= this.level && level !== Level.DISABLED) {
			this.outputStrategy.log(logger.getName(), level, payload, errorStack);
		}
	}

	public setLevelByName(name: string): void {
		switch ((isDefined(name) ? name : "INFO").toUpperCase()) {
			case "TRACE":
				LoggerServiceImpl.INSTANCE.setLevel(Level.TRACE);
				break;

			case "DEBUG":
				LoggerServiceImpl.INSTANCE.setLevel(Level.DEBUG);
				break;

			case "WARN":
				LoggerServiceImpl.INSTANCE.setLevel(Level.WARN);
				break;

			case "ERROR":
				LoggerServiceImpl.INSTANCE.setLevel(Level.ERROR);
				break;

			case "FATAL":
				LoggerServiceImpl.INSTANCE.setLevel(Level.FATAL);
				break;

			case "DISABLED":
				LoggerServiceImpl.INSTANCE.setLevel(Level.DISABLED);
				break;

			default:
				LoggerServiceImpl.INSTANCE.setLevel(Level.INFO);
		}
	}

	public setLevel(level: Level): void {
		this.level = level;
	}

	public isTrace(): boolean {
		return Level.TRACE >= this.level;
	}

	public isDebug(): boolean {
		return Level.DEBUG >= this.level;
	}

	public isInfo(): boolean {
		return Level.INFO >= this.level;
	}

	public isWarn(): boolean {
		return Level.WARN >= this.level;
	}

	public isError(): boolean {
		return Level.ERROR >= this.level;
	}

	public isFatal(): boolean {
		return Level.FATAL >= this.level;
	}

	public isDisabled(): boolean {
		return Level.DISABLED >= this.level;
	}
}

export default LoggerServiceImpl;
