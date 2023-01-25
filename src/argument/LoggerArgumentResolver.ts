import ArgumentResolver from 'argument/ArgumentResolver';
import OutputStrategy from "log/OutputStrategy";
import LoggerFactory from "log/LoggerFactory";
import { Context } from "context/Context";

class LoggerArgumentResolver implements ArgumentResolver {
	private logName: string;
	private level: string;
	private strategy: OutputStrategy;

	constructor(name: string, level: string, strategy: OutputStrategy) {
		this.logName = name;
		this.level = level;
		this.strategy = strategy;
	}

	public resolve(context: Context): any {
		return LoggerFactory.getLogger(this.logName, this.level, this.strategy);
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default LoggerArgumentResolver;
