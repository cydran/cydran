import Level from "./Level";
import Logger from "./Logger";

interface OutputStrategy {

	log(logger: Logger, level: Level, payload: any, error?: Error): void;

}

export default OutputStrategy;
