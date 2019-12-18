import ConsoleOutputStrategy from "./ConsoleOutputStrategy";
import Level from "./Level";
import LevelUtils from "./LevelUtils";
import Logger from "./Logger";
import LoggerImpl from "./LoggerImpl";
import LoggerService from "./LoggerService";
import OutputStrategy from "./OutputStrategy";

class LoggerServiceImpl implements LoggerService {

	public static INSTANCE: LoggerServiceImpl = new LoggerServiceImpl();

	private level: Level;

	private outputStrategy: OutputStrategy;

	private logger: LoggerImpl;

	constructor() {
		this.level = Level.INFO;
		this.outputStrategy = new ConsoleOutputStrategy();
		this.logger = new LoggerImpl("LoggerService", this);
	}

	public log(logger: Logger, level: Level, payload: any, errorStack?: Error | boolean): void {
		if (level >= this.level && level !== Level.DISABLED) {
			this.outputStrategy.log(logger, level, payload, errorStack);
		}
	}

	public setLevel(level: Level): void {
		this.level = level;
		this.log(this.logger, Level.DEBUG, "Logging level: " + LevelUtils.stringValueOf(level));
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

export default LoggerServiceImpl;
