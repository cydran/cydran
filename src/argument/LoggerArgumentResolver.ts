import Module from "module/Module";
import ArgumentResolver from 'argument/ArgumentResolver';
import LoggerFactory from "log/LoggerFactory";

class LoggerArgumentResolver implements ArgumentResolver {
	private logName: string;
	private level: string;

	constructor(name: string, level: string) {
		this.logName = name;
		this.level = level;
	}

	public resolve(module: Module): any {
		return LoggerFactory.getLogger(this.logName, this.level);
	}

	public postProcess(module: Module, target: any, param: any): void {
		// Intentionally do nothing
	}

}

export default LoggerArgumentResolver;
