import ArgumentResolver from 'argument/ArgumentResolver';
import { OutputStrategy } from "log/OutputStrategy";
import LoggerFactory from "log/LoggerFactory";
import { Context } from "context/Context";

class OutputStrategyResolver implements ArgumentResolver {
	private strategy: OutputStrategy;
	private stratId: string;

	constructor(id: string, strategy: OutputStrategy) {
		this.stratId = id;
		this.strategy = strategy;
	}

	public resolve(context: Context): any {
		return LoggerFactory.registerOutputStrategy(this.stratId, this.strategy);
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default OutputStrategyResolver;
