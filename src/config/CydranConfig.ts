import LoggerServiceImpl from "log/LoggerServiceImpl";
import Level from "log/Level";

class CydranConfig {
	constructor() {
		/**/
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
