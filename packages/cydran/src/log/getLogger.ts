import Logger from 'log/Logger';
import LoggerFactoryAlternative from 'log/LoggerFactoryAlternative';

function getLogger(name: string): Logger {
	return LoggerFactoryAlternative.getLogger(name);
}

export default getLogger;