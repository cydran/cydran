import Level from "./logger/Level";
import LoggerService from "./logger/LoggerService";

class Config {
	private dataSetNS: string = "data-c";

	constructor() {
		if(!(this instanceof Config)) {
			throw TypeError(new.target.name + " should be an instance of Config");
		}
	}

	public useTrace(): void {
		LoggerService.INSTANCE.setLevel(Level.TRACE);
	}

	public useDebug(): void {
		LoggerService.INSTANCE.setLevel(Level.DEBUG);
	}

	public useInfo(): void {
		LoggerService.INSTANCE.setLevel(Level.INFO);
	}

	public useError(): void {
		LoggerService.INSTANCE.setLevel(Level.ERROR);
	}

	public useFatal(): void {
		LoggerService.INSTANCE.setLevel(Level.FATAL);
	}

	public useDisable(): void {
		LoggerService.INSTANCE.setLevel(Level.DISABLE);
	}

	public useNameSpace(ns: string): Config {
		this.dataSetNS = ns;
		return this;
	}

	public nameSpace(): string {
		return this.dataSetNS;
	}

	public eventNameSpace(): string {
		return this.dataSetNS + "-on";
	}

}

export default Config;
