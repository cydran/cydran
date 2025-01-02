import Logger from "log/Logger";
import LoggerAlternativeImpl from "log/LoggerAlternativeImpl";
import { requireNotNull } from "util/Utils";
import GlobalContextHolder from "context/GlobalContextHolder";

class LoggerFactoryAlternative {

	public static getLogger(key: string, label?: string): Logger {
		requireNotNull(name, "name");

		return new LoggerAlternativeImpl(GlobalContextHolder.getContext(), key, label); // LoggerFactoryAlternative.properties
	}

}

export default LoggerFactoryAlternative;
