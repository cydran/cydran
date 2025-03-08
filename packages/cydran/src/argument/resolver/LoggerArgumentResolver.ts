import ArgumentResolver from 'argument/ArgumentResolver';
import { Context } from "context/Context";
import { requireNotNull } from 'util/Utils';

class LoggerArgumentResolver implements ArgumentResolver {

	private key: string;

	private label: string;

	constructor(key: string, label?: string) {
		this.key = requireNotNull(key, "key");
		this.label = label;
	}

	public resolve(context: Context): any {
		return context.getObject("logger", this.key, this.label);
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default LoggerArgumentResolver;
