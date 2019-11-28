import Level from "./Level";
import Logger from "./Logger";

interface OutputStrategy {

	log(logger: Logger, level: Level, payload: any, err_stack?: Error | boolean): void;

}

export default OutputStrategy;
