import Module from "module/Module";
import ArgumentResolver from 'argument/ArgumentResolver';
import OutputStrategy from "log/OutputStrategy";

class OutputStrategyResolver implements ArgumentResolver {
	private strategy: OutputStrategy;
	private stratId: string;

	constructor(id: string, strategy: OutputStrategy) {
		this.stratId = id;
		this.strategy = strategy;
	}

	public resolve(module: Module): any {
		return module.getCydranContext().logFactory().registerOutputStrategy(this.stratId, this.strategy);
	}

	public postProcess(module: Module, target: any, param: any): void {
		// Intentionally do nothing
	}

}

export default OutputStrategyResolver;
