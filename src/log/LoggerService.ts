import Logger from "log/Logger";
import Level from "log/Level";
import OutputStrategy from "log/OutputStrategy";

interface LoggerService {

	log(logger: Logger, level: Level, payload: any, errorStack?: Error | boolean): void;

	willMeet(level: Level): boolean;
}

export default LoggerService;
