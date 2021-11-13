import Level from "log/Level";
import Logger from "log/Logger";
import LoggerService from "log/LoggerService";
import OutputStrategy from "log/OutputStrategy";
import ConsoleOutputStrategy from "log/ConsoleOutputStrategy";
import { isDefined } from "util/Utils";
import { Properties } from 'properties/Property';
import { PropertyKeys } from "Constants";

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

	public setColorPallet(colors: Properties): void {
		const outStrat: ConsoleOutputStrategy = this.outputStrategy as ConsoleOutputStrategy;
		outStrat.setColorPallet(colors);
	}

	public log(logger: Logger, level: Level, payload: any, errorStack?: Error | boolean): void {
		if (level >= this.level && level !== Level.DISABLED) {
			this.outputStrategy.log(logger.getName(), level, payload, errorStack);
		}
	}

	public setLevelByName(name: string): void {
		let newLevel: Level = Level.INFO;
		switch ((isDefined(name) ? name : "").toUpperCase()) {
			case "TRACE":
				newLevel = Level.TRACE;
				break;
			case "DEBUG":
				newLevel = Level.DEBUG;
				break;
			case "WARN":
				newLevel = Level.WARN;
				break;
			case "ERROR":
				newLevel = Level.ERROR;
				break;
			case "FATAL":
				newLevel = Level.FATAL;
				break;
			case "DISABLED":
				newLevel = Level.DISABLED;
				break;

			default:
				break;
		}
		LoggerServiceImpl.INSTANCE().setLevel(newLevel);
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
