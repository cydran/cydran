import Logger from "./Logger";
import LoggerImpl from "./LoggerImpl";
import LoggerService from "./LoggerService";

class LoggerFactory {

	public static getLogger(name: string): Logger {
		return new LoggerImpl(name, LoggerService.INSTANCE);
	}

}

export default LoggerFactory;
