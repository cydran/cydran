import Context from "context/Context";
import ArgumentResolver from 'argument/ArgumentResolver';
import OutputStrategy from "log/OutputStrategy";

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
		return context.getServices().logFactory().getLogger(this.logName, this.level, this.strategy);
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default LoggerArgumentResolver;
