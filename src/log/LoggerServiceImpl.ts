import Level from "log/Level";
import Logger from "log/Logger";
import LoggerService from "log/LoggerService";
import LoggerImpl from "log/LoggerImpl";
import OutputStrategy from "log/OutputStrategy";
import ConsoleOutputStrategy from "log/ConsoleOutputStrategy";
import { isDefined } from "util/Utils";
import { Properties } from "properties/Property";
import { PropertyKeys } from "Constants";
import PropertiesImpl from "properties/PropertiesImpl";

class LoggerServiceImpl implements LoggerService {
	private logLogr: Logger;
	private static readonly logName: string = "LoggerService";

	private level: Level = Level.INFO;

	private outputStrategy: OutputStrategy;

	public constructor(props: Properties = new PropertiesImpl()) {
		this.outputStrategy = new ConsoleOutputStrategy(props);
		this.logLogr = new LoggerImpl(LoggerServiceImpl.logName, this);
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
		const baseLevel: Level = logger.getLevel();
		if (baseLevel !== Level.DISABLED && level >= baseLevel) {
			const customStrategy: OutputStrategy = (logger as LoggerImpl).getOutputStrategy();
			const outStrat: OutputStrategy = isDefined(customStrategy) ? customStrategy : this.outputStrategy;
			outStrat.log(logger.getName(), level, payload, errorStack);
		}
	}

	public getLevel(): Level {
		return this.level;
	}

	public setLevelByName(name: string = "unknown"): void {
		try {
			const newLevel: Level = Level[name.toUpperCase()];
			if(isDefined(newLevel)) {
				if(this.level === newLevel) {
					this.logLogr.ifDebug(() => `General log level is already set @ ${ this.getLevelAsString() }`);
					return;
				}
				this.setLevel(newLevel);
			} else {
				this.logLogr.ifDebug(() => `"${ name }" not a valid logging level`);
			}
		} catch (err) {
			this.logLogr.ifDebug(() => `General log level remains @ ${ this.getLevelAsString() }. ${ err.message }`);
		}
	}

	public setLevel(level: Level): void {
		const lvlStr: string = this.getLevelAsString();
		this.level = level;

		const moreInfo: string = (level !== this.level) ? ` from "${ lvlStr }"` : "";
		this.logLogr.ifDebug(() => `General log level set @ "${ this.getLevelAsString() }"${ moreInfo }`);
	}

	public willMeet(level: Level): boolean {
		return level >= this.level;
	}

	public getLevelAsString(): string {
		return Level[this.level];
	}
}

export default LoggerServiceImpl;
