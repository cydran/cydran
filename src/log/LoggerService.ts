import Logger from "log/Logger";
import Level from "log/Level";
import OutputStrategy from "log/OutputStrategy";
import { Properties } from "properties/Property";

interface LoggerService {

	log(logger: Logger, level: Level, payload: any, errorStack?: Error | boolean, stratKey?: string): void;

	updateServicePrefs(props: Properties): void;
	 getLevel(): Level;
	setLevelByName(level: string): void;
	setLevel(level: Level): void;
	willMeet(level: Level): boolean;
	registerOutputStrategy(key: string, strat: OutputStrategy): void;
	removeOutputStrategy(key: string): void;
	setPrefsForStrategy(key: string, props: Properties): void;
}

export default LoggerService;
