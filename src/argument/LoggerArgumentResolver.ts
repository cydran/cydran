import Module from "module/Module";
import ArgumentResolver from 'argument/ArgumentResolver';
import LoggerFactory from "log/LoggerFactory";

class LoggerArgumentResolver implements ArgumentResolver {
	private logName: string;

	constructor(name: string) {
		this.logName = name;
	}

	public resolve(module: Module): any {
		return LoggerFactory.getLogger(this.logName);
	}

	public postProcess(module: Module, target: any, param: any): void {
		// Intentionally do nothing
	}

}

export default LoggerArgumentResolver;
