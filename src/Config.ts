import LoggerService from './logger/LoggerService';
import Level from './logger/Level';

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

}

export default Config;
