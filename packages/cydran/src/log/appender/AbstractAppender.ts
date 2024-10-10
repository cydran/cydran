import { Appender } from "log/appender/Appender";
import Level from "log/Level";

const doPreamble = (logName: string, lvl: Level, pOrder: string[]): string => {
	let result: string = "";
	for(const tok of pOrder) {
		switch(tok) {
			case "time":
				result += getNow() + " ";
				break;
			case "level":
				result += "[" + lvl.padEnd(5, " ") + "] ";
				break;
			case "name":
				result += "[ " + logName + " ] ";
				break;
			default:
				break;
		}
	};
	return result.trim();
}

const getNow = (): string => {
	const now = new Date();
	return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}`;
};

export abstract class AbstractAppender implements Appender {
	private id: string;

	constructor(id: string) {
		this.id = id;
	}

	public getId(): string {
		return this.id;
	}

	public createPreamble(logName: string, lvl: Level, pOrder: string[]): string {
		return doPreamble(logName, lvl, pOrder);
	}

	abstract getAlias(): string;

	abstract trace(name: string, payload: any, ...params: any): void;

	abstract debug(name: string, payload: any, ...params: any): void;

	abstract info(name: string, payload: any, ...params: any): void;

	abstract warn(name: string, payload: any, ...params: any): void;

	abstract error(name: string, payload: any, ...params: any): void;
	
	abstract fatal(name: string, payload: any, ...params: any): void;
	
	abstract log(level: Level, name: string, payload: any, ...params: any): void;
}