import Level from "log/Level";
import Logger from "log/Logger";
import LoggerService from "log/LoggerService";
import LoggerImpl from "log/LoggerImpl";
import OutputStrategy from "log/OutputStrategy";
import ConsoleOutputStrategy from "log/ConsoleOutputStrategy";
import { isDefined } from "util/Utils";
import { Properties } from "properties/Property";
import { IllegalArgumentError } from "error/Errors";
import { PropertyKeys } from "Constants";
import PropertiesImpl from "properties/PropertiesImpl";

class LoggerServiceImpl implements LoggerService {
	private logLogr: Logger;

	private level: Level = Level.INFO;

	private outputStrategy: OutputStrategy;

	public constructor(props: Properties = new PropertiesImpl()) {
		this.outputStrategy = new ConsoleOutputStrategy(props);
		this.logLogr = new LoggerImpl("LoggerService", this);
		this.setPreferences(props);
	}

	public setPreferences(props: Properties): void {
		const outStrat: ConsoleOutputStrategy = this.outputStrategy as ConsoleOutputStrategy;
		this.outputStrategy.setTag(props.getAsString(PropertyKeys.CYDRAN_LOG_LABEL));
		this.outputStrategy.setTagVisibility(props.get(PropertyKeys.CYDRAN_LOG_LABEL_VISIBLE));
		outStrat.updateColorPallet(props);
		this.setLevelByName(props.getAsString(PropertyKeys.CYDRAN_LOG_LEVEL));
	}

	public log(logger: Logger, level: Level, payload: any, errorStack?: Error | boolean): void {
		const wkLevel: Level = isDefined(logger.getLevel()) ? logger.getLevel() : this.level;
		if (level >= wkLevel && level !== Level.DISABLED) {
			this.outputStrategy.log(logger.getName(), level, payload, errorStack);
		}
	}

	public setLevelByName(name: string = "null"): void {
		try {
			const newLevel: Level = Level[name.toUpperCase()];
			if(isDefined(newLevel)) {
				if(this.level === newLevel) {
					this.logLogr.ifDebug(() => `Log level is already set @ ${ this.getLevelAsString() }`);
					return;
				}
				this.setLevel(newLevel);
			} else {
				throw new IllegalArgumentError(`"${ name.toUpperCase() }" not a valid logging level`);
			}
		} catch (err) {
			this.logLogr.ifDebug(() => `Log level remains @ ${ this.getLevelAsString() }. ${ err.message }`);
		}
	}

	public setLevel(level: Level): void {
		const lvlStr: string = this.getLevelAsString();
		this.level = level;

		const moreInfo: string = (level !== this.level) ? ` from "${ lvlStr }"` : "";
		this.logLogr.ifDebug(() => `Log level set @ "${ this.getLevelAsString() }"${ moreInfo }`);
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

	public getLevelAsString(): string {
		return Level[this.level];
	}
}

export default LoggerServiceImpl;
