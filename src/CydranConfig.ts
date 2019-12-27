import Level from "@/logger/Level";
import LoggerServiceImpl from "@/logger/LoggerServiceImpl";

class CydranConfig {

	constructor() {
		if (!(this instanceof CydranConfig)) {
			throw TypeError(new.target.name + " should be an instance of Config");
		}
	}

	public useTrace(): void {
		LoggerServiceImpl.INSTANCE.setLevel(Level.TRACE);
	}

	public useDebug(): void {
		LoggerServiceImpl.INSTANCE.setLevel(Level.DEBUG);
	}

	public useInfo(): void {
		LoggerServiceImpl.INSTANCE.setLevel(Level.INFO);
	}

	public useWarn(): void {
		LoggerServiceImpl.INSTANCE.setLevel(Level.WARN);
	}

	public useError(): void {
		LoggerServiceImpl.INSTANCE.setLevel(Level.ERROR);
	}

	public useFatal(): void {
		LoggerServiceImpl.INSTANCE.setLevel(Level.FATAL);
	}

	public useDisabled(): void {
		LoggerServiceImpl.INSTANCE.setLevel(Level.DISABLED);
	}
}

export default CydranConfig;
