import { Appender } from "log/appender/Appender";

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

	abstract trace(label: string, message: string, error?: Error, moreArgs?: any[]): void;

	abstract debug(label: string, message: string, error?: Error, moreArgs?: any[]): void;

	abstract info(label: string, message: string, error?: Error, moreArgs?: any[]): void;

	abstract warn(label: string, message: string, error?: Error, moreArgs?: any[]): void;

	abstract error(label: string, message: string, error?: Error, moreArgs?: any[]): void;
	
	abstract fatal(label: string, message: string, error?: Error, moreArgs?: any[]): void;
	
}