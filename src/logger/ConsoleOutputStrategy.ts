import OutputStrategy from './OutputStrategy';
import Logger from './Logger';

class ConsoleOutputStrategy implements OutputStrategy {

	public log(logger: Logger, level: string, payload: any, error?: Error): void {
		let prefix = this.getNow() + ' ' + level + ' [' + logger.getName() + ']';

		if (error) {
			console.log(prefix, payload, error.message, error.stack);
		} else {
			console.log(prefix, payload);
		}
	}

	private getNow(): string {
		let now = new Date();

		return now.getUTCFullYear()
			+ '-'
			+ now.getUTCMonth()
			+ '-'
			+ now.getUTCDate()
			+ ' '
			+ now.getUTCHours()
			+ ':'
			+ now.getUTCMinutes()
			+ ':'
			+ now.getUTCSeconds()
			+ ':'
			+ now.getUTCMilliseconds();
	}

}

export default ConsoleOutputStrategy;