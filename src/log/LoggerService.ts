import Level from "@/log/Level";
import Logger from "@/log/Logger";

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