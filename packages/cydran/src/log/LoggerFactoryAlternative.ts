import Logger from "log/Logger";
import LoggerAlternativeImpl from "log/LoggerAlternativeImpl";
import PropertiesAlternativeImpl from "properties/PropertiesAlternativeImpl";
import { requireNotNull } from "util/Utils";
import { Properties } from 'properties/Property';

class LoggerFactoryAlternative {

	private static properties: Properties = new PropertiesAlternativeImpl();

	public static getLogger(name: string): Logger {
		requireNotNull(name, "name");

		return new LoggerAlternativeImpl(name, null); // LoggerFactoryAlternative.properties
	}

}

export default LoggerFactoryAlternative;
