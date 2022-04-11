import EachConfig from "behavior/core/each/EachConfig";
import { requireNotNull } from 'util/Utils';

class EachConfigImpl implements EachConfig {

	private expression: string;

	private prefix: string;

	private behaviorPrefix: string;

	constructor(expression: string, prefix: string, behaviorPrefix: string) {
		this.expression = requireNotNull(expression, "expression");
		this.prefix = requireNotNull(prefix, "prefix");
		this.behaviorPrefix = requireNotNull(behaviorPrefix, "behaviorPrefix");
	}

	public getExpression(): string {
		return this.expression;
	}

	public getPrefix(): string {
		return this.prefix;
	}

	public getBehaviorPrefix(): string {
		return this.behaviorPrefix;
	}

}

export default EachConfigImpl;
