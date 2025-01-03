import { Appender } from "log/appender/Appender";
import Level from "log/Level";
import { Properties } from "properties/Property";

export const getNow = (): string => {
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

	abstract getAlias(): string;

	abstract trace(name: string, msgBase: string, ...params: any): void;

	abstract debug(name: string, msgBase: string, ...params: any): void;

	abstract info(name: string, msgBase: string, ...params: any): void;

	abstract warn(name: string, msgBase: string, ...params: any): void;

	abstract error(name: string, msgBase: string, ...params: any): void;
	
	abstract fatal(name: string, msgBase: string, ...params: any): void;
	
	abstract log(level: Level, name: string, msgBase: string, ...params: any): void;
	
}