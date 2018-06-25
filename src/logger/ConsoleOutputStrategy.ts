import OutputStrategy from './OutputStrategy';
import Logger from './Logger';

class ConsoleOutputStrategy implements OutputStrategy {

	public log(logger: Logger, level: string, payload: any, error?: Error): void {
		let prefix = level + ' [' + logger.getName() + ']';

		if (error) {
			console.log(prefix, payload, error.message, error.stack);
		} else {
			console.log(prefix, payload);
		}
	}

}

export default ConsoleOutputStrategy;