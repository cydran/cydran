import Module from "module/Module";
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

	public resolve(module: Module): any {
		return module.getCydranContext().logFactory().getLogger(this.logName, this.level, this.strategy);
	}

	public postProcess(module: Module, target: any, param: any): void {
		// Intentionally do nothing
	}

}

export default LoggerArgumentResolver;
