import Level from "./logger/Level";
import LoggerService from "./logger/LoggerService";

class Config {

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

}

export default Config;
