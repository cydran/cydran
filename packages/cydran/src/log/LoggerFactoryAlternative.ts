import Logger from "log/Logger";
import LoggerAlternativeImpl from "log/LoggerAlternativeImpl";
import PropertiesImpl from "properties/PropertiesImpl";
import { requireNotNull } from "util/Utils";
import { Properties } from 'properties/Property';
import { IdGenerator } from "util/IdGenerator";

class LoggerFactoryAlternative {

	private static properties: Properties = new PropertiesImpl();

	public static getLogger(name: string, id: string = IdGenerator.generate()): Logger {
		requireNotNull(name, "name");

		return new LoggerAlternativeImpl(name, id, null); // LoggerFactoryAlternative.properties
	}

}

export default LoggerFactoryAlternative;
