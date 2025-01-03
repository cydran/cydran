import ArgumentResolver from 'argument/ArgumentResolver';
import { Appender } from "log/appender/Appender";
import { Context } from "context/Context";

class LoggerArgumentResolver implements ArgumentResolver {

	private name: string;

	private level: string;

	private appender: Appender;

	constructor(name: string, level: string, appender: Appender) {
		this.name = name;
		this.level = level;
		this.appender = appender;
	}

	public resolve(context: Context): any {
		return context.getObject("logger", this.name);
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default LoggerArgumentResolver;
