import Logger from "./Logger";
import Level from "./Level";

interface OutputStrategy {

	log(logger: Logger, level: Level, payload: any, error?: Error): void;

}

export default OutputStrategy;
