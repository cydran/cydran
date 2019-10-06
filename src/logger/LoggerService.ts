import ConsoleOutputStrategy from "./ConsoleOutputStrategy";
import Level from "./Level";
import Logger from "./Logger";
import OutputStrategy from "./OutputStrategy";

class LoggerService {

	public static INSTANCE: LoggerService = new LoggerService();

	private level: Level;

	private outputStrategy: OutputStrategy;

	constructor() {
		this.level = Level.INFO;
		this.outputStrategy = new ConsoleOutputStrategy();
	}

	public log(logger: Logger, level: Level, payload: any, error?: Error): void {
		if (level >= this.level && level != Level.DISABLE) {
			this.outputStrategy.log(logger, level, payload, error);
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

	public isError(): boolean {
		return (Level.ERROR >= this.level);
	}

	public isFatal(): boolean {
		return (Level.FATAL >= this.level);
	}

	public isDisable(): boolean {
		return (Level.DISABLE >= this.level);
	}

}

export default LoggerService;
