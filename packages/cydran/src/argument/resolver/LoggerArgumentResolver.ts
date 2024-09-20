import ArgumentResolver from 'argument/ArgumentResolver';
import { OutputStrategy } from "log/OutputStrategy";
import { Context } from "context/Context";
import { IdGenerator } from 'util/IdGenerator';

class LoggerArgumentResolver implements ArgumentResolver {

	private id: string;

	private name: string;

	private level: string;

	private strategy: OutputStrategy;

	constructor(name: string, level: string, strategy: OutputStrategy, id: string = IdGenerator.generate()) {
		this.id = id;
		this.name = name;
		this.level = level;
		this.strategy = strategy;
	}

	public resolve(context: Context): any {
		return context.getObject("logger", this.name, this.id);
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default LoggerArgumentResolver;
