import ArgumentResolver from 'argument/ArgumentResolver';
import { Appender } from "log/appender/Appender";
import { Context } from "context/Context";

class LoggerArgumentResolver implements ArgumentResolver {

	private label: string;

	private level: string;

	private appender: Appender;

	constructor(label: string, level: string, appender: Appender) {
		this.label = label;
		this.level = level;
		this.appender = appender;
	}

	public resolve(context: Context): any {
		return context.getObject("logger", this.label);
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default LoggerArgumentResolver;
