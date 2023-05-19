import Logger from "log/Logger";
import LoggerAlternativeImpl from "log/LoggerAlternativeImpl";
import PropertiesAlternativeImpl from "properties/PropertiesAlternativeImpl";
import { requireNotNull } from "util/Utils";

class LoggerFactoryAlternative {

	public static getLogger(name: string): Logger {
		requireNotNull(name, "name");

		return new LoggerAlternativeImpl(name, new PropertiesAlternativeImpl());
	}

}

export default LoggerFactoryAlternative;
