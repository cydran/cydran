import { Disposable, Gettable } from "interface/Ables";
import { Level } from "log/Level";

interface IdStrategy {

	check(item: any): boolean;

	enrich(item: any, index: number): void;

	extract(item: any): string;

	init(): void;

}

interface OutputStrategy {
	/**
	 * Log the message
	 * @param logname name of the log
	 * @param level {Level} of message
	 * @param payload message/object to be logged
	 * @param error optional object or boolean to indicate +/- on whether or not to log the stack/message
	 */
	log(logname: string, level: Level, payload: any, errorStack?: Error | boolean): void;
}

interface ElementStrategy {
	consume(): void;
}

interface RegistryStrategy extends Disposable {
	get<T>(id: string, gettable: Gettable): T;
}


export {
	ElementStrategy,
	IdStrategy,
	OutputStrategy,
	RegistryStrategy
};
