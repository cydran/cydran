import Level from "log/Level";
import Logger from "log/Logger";
import LoggerService from "log/LoggerService";
import OutputStrategy from "log/OutputStrategy";
import ConsoleOutputStrategy from "log/ConsoleOutputStrategy";

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
