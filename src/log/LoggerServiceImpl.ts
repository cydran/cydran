import Level from "log/Level";
import Logger from "log/Logger";
import LoggerService from "log/LoggerService";
import LoggerImpl from "log/LoggerImpl";
import OutputStrategy from "log/OutputStrategy";
import ConsoleOutputStrategy from "log/ConsoleOutputStrategy";
import { isDefined, requireNotNull } from "util/Utils";
import { Properties } from "properties/Property";
import { IllegalArgumentError } from "error/Errors";
import { PropertyKeys } from "Constants";

class LoggerServiceImpl implements LoggerService {
	private static instance: LoggerServiceImpl;
	private logLogr: Logger;

	public static INSTANCE = (props?: Properties): LoggerServiceImpl => {
		if (!LoggerServiceImpl.instance) {
			LoggerServiceImpl.instance = new LoggerServiceImpl(props);
		}
		return LoggerServiceImpl.instance;
	}

	private level: Level = Level.INFO;

	private outputStrategy: OutputStrategy;

	private constructor(props?: Properties) {
		this.outputStrategy = new ConsoleOutputStrategy(props);
		if(isDefined(props)) {
			this.updateLoggingProperties(props);
		}
		this.logLogr = new LoggerImpl("LoggerService", this);
	}

	public updateLoggingProperties(props: Properties): void {
		const outStrat: ConsoleOutputStrategy = this.outputStrategy as ConsoleOutputStrategy;
		outStrat.updateColorPallet(props);
		this.setLevelByName(props.getAsString(PropertyKeys.CYDRAN_LOGGING_LEVEL));
	}

	public log(logger: Logger, level: Level, payload: any, errorStack?: Error | boolean): void {
		if (level >= this.level && level !== Level.DISABLED) {
			this.outputStrategy.log(logger.getName(), level, payload, errorStack);
		}
	}

	public setLevelByName(name: string): void {
		try {
			requireNotNull(name, "name");

			const newLevel: Level = Level[name.toUpperCase()];
			if(isDefined(newLevel)) {
				LoggerServiceImpl.INSTANCE().setLevel(newLevel);
			} else {
				throw new IllegalArgumentError(`${ name.toUpperCase() } not a valid logging level`);
			}
		} catch (err) {
			this.logLogr.error(`Log level remains @ ${ Level[this.level] }`, err);
		}
	}

	public setLevel(level: Level): void {
		const lvlStr: string = Level[this.level];
		this.level = level;

		const moreInfo: string = (level !== this.level) ? ` from "${ lvlStr }"` : "";
		this.logLogr.debug(`Log level set @ "${ Level[level] }"${ moreInfo }`);
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
