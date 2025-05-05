import ArgumentResolver from 'argument/ArgumentResolver';
import { Context } from "context/Context";
import { requireNotNull } from 'util/Utils';
import Logger from 'log/Logger';

class LoggerArgumentResolver implements ArgumentResolver<Logger> {

	private key: string;

	private label: string;

	constructor(key: string, label?: string) {
		this.key = requireNotNull(key, "key");
		this.label = label;
	}

	public resolve(context: Context): Logger {
		return context.getObject("logger", this.key, this.label) as Logger;
	}

	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default LoggerArgumentResolver;
