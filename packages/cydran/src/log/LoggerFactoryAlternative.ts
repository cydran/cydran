import Logger from "log/Logger";
import LoggerAlternativeImpl from "log/LoggerAlternativeImpl";
import PropertiesImpl from "properties/PropertiesImpl";
import { requireNotNull } from "util/Utils";
import { Properties } from 'properties/Property';

class LoggerFactoryAlternative {

	private static properties: Properties = new PropertiesImpl();

	public static getLogger(name: string): Logger {
		requireNotNull(name, "name");

		return new LoggerAlternativeImpl(name, null); // LoggerFactoryAlternative.properties
	}

}

export default LoggerFactoryAlternative;
