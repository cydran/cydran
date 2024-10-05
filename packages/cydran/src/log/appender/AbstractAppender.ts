import { Appender } from "log/appender/Appender";

export abstract class AbstractAppender implements Appender {
	abstract trace(payload: any, ...param: any): void;
	abstract debug(payload: any, ...param: any): void;
	abstract info(payload: any, ...param: any): void;
	abstract warn(payload: any, ...param: any): void;
	abstract error(payload: any, ...param: any): void;
	abstract fatal(payload: any, ...param: any): void;
}