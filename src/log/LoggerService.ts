import Logger from "log/Logger";
import Level from "log/Level";
import OutputStrategy from "log/OutputStrategy";

interface LoggerService {
	getLevel(): Level;

	log(logger: Logger, level: Level, payload: any, errorStack?: Error | boolean, stratKey?: string): void;

	updateServicePrefs(props: Properties): void;
	setLevelByName(level: string): void;
	setLevel(level: Level): void;
	willMeet(level: Level): boolean;
	registerOutputStrategy(key: string, strat: OutputStrategy): void;
	removeOutputStrategy(key: string): void;
	setPrefsForStrategy(key: string, props: Properties): void;
}

export default LoggerService;
