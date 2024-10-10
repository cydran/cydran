import { Appender } from "log/appender/Appender";
import Level from "log/Level";

export abstract class AbstractAppender implements Appender {
	private id: string;

	constructor(id: string) {
		this.id = id;
	}

	public getId(): string {
		return this.id;
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