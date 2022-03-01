import Level from "log/Level";
import Logger from "log/Logger";
import LoggerService from "log/LoggerService";
import LoggerImpl from "log/LoggerImpl";
import OutputStrategy from "log/OutputStrategy";
import { isDefined, requireNotNull } from "util/Utils";
import { Properties } from "properties/Property";
import { PropertyKeys } from "Constants";
import OutputStrategyProvider from "log/OutputStrategyProvider";
import PropertiesImpl from "properties/PropertiesImpl";

class LoggerServiceImpl implements LoggerService {
	private logLogr: Logger;
	private outProvider: OutputStrategyProvider;
	private globalLevel: Level = Level.DISABLED;
	private currentStrat: string;

	public constructor(props: Properties) {
		this.logLogr = new LoggerImpl("LoggerService", this);
		this.outProvider = new OutputStrategyProvider(props);
		this.logLogr.ifDebug(() => `Set preferences for general logging`);
		this.doServicePrefs(props);
	}

	public updateServicePrefs(props: Properties): void {
		this.doServicePrefs(requireNotNull(props, "props"));
		this.logLogr.ifDebug(() => `Updated preferences for general logging`);
	}

	private doServicePrefs(props: Properties): void {
		if(isDefined(props)) {
			const wkLevel: string = props.getAsString(PropertyKeys.CYDRAN_LOG_LEVEL);
			this.setLevelByName(wkLevel);
			this.currentStrat = props.getAsString(PropertyKeys.CYDRAN_LOG_STRATEGY);
		} else {
			this.logLogr.ifDebug(() => `No preferences to update`);
		}
	}

	public registerOutputStrategy(key: string, strat: OutputStrategy): void {
		this.outProvider.registerStrategy(requireNotNull(key, "key"), () => { return strat; });
	}

	public removeOutputStrategy(key: string) {
		this.outProvider.removeStrategy(requireNotNull(key, "key"));
	}

	public setPrefsForStrategy(key: string, props: Properties = new PropertiesImpl()) {
		const wkStrat: OutputStrategy = this.outProvider.getStrategy(key);
		const OLS: string = "output log strategy";
		let attempted: boolean = false;
		if(isDefined(wkStrat)) {
			attempted = true;
			wkStrat.setPreferences(props);
		}
		this.logLogr.ifDebug(() => `Attempt to set prefs for "${ key }" ${ OLS }: ${ attempted }`);
	}

	public log(logger: Logger, level: Level, payload: any, errorStack?: Error | boolean, stratKey: string = this.currentStrat): void {
		const baseLevel: Level = logger.getLevel();
		if (baseLevel !== Level.DISABLED && level >= baseLevel) {
			const outStrat: OutputStrategy = this.outProvider.getStrategy((logger as LoggerImpl).getStrategyId() || stratKey);
			outStrat.log(logger.getName(), level, payload, errorStack);
		}
	}

	public getLevel(): Level {
		return this.globalLevel;
	}

	public setLevelByName(name: string = "unknown"): void {
		try {
			const newLevel: Level = this.getLevelFromString(name);
			if(isDefined(newLevel)) {
				if(this.globalLevel === newLevel) {
					this.logLogr.ifDebug(() => `General log level is already set @ "${ this.getLevelAsString() }"`);
					return;
				}
				this.setLevel(newLevel);
			} else {
				throw new Error(`"${ name }" not a valid logging level`);
			}
		} catch (err) {
			this.logLogr.ifDebug(() => `General log level remains @ "${ this.getLevelAsString() }". ${ err.message }`);
		}
	}

	public setLevel(level: Level): void {
		const moreInfo: string = (level !== this.globalLevel) ? ` from "${ this.getLevelAsString() }"` : "";
		this.globalLevel = level;

		this.logLogr.ifDebug(() => `General log level set @ "${ this.getLevelAsString() }"${ moreInfo }`);
	}

	public willMeet(level: Level): boolean {
		return level >= this.globalLevel;
	}

	public getLevelAsString(): string {
		return Level[this.globalLevel];
	}

	private getLevelFromString(level: string): Level {
		return Level[level.toUpperCase()];
	}
}

export default LoggerServiceImpl;
