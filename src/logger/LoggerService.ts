import Level from "./Level";
import Logger from "./Logger";

interface LoggerService {

	log(logger: Logger, level: Level, payload: any, errorStack?: Error | boolean): void;

	isTrace(): boolean;

	isDebug(): boolean;

	isInfo(): boolean;

	isWarn(): boolean;

	isError(): boolean;

	isFatal(): boolean;

	isDisabled(): boolean;

}

export default LoggerService;
