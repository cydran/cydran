import ArgumentResolver from 'argument/ArgumentResolver';
import { OutputStrategy } from "log/strategy/OutputStrategy";
import { Context } from "context/Context";

class LoggerArgumentResolver implements ArgumentResolver {

	private name: string;

	private level: string;

	private strategy: OutputStrategy;

	constructor(name: string, level: string, strategy: OutputStrategy) {
		this.name = name;
		this.level = level;
		this.strategy = strategy;
	}

	public resolve(context: Context): any {
		return context.getObject("logger", this.name);
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default LoggerArgumentResolver;
