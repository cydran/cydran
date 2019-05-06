import Logger from "./Logger";
import OutputStrategy from "./OutputStrategy";

class ConsoleOutputStrategy implements OutputStrategy {

	public log(logger: Logger, level: string, payload: any, error?: Error): void {
		const prefix = this.getNow() + " " + level + " [" + logger.getName() + "]";

		if (error) {
			// tslint:disable-next-line
			console.log(prefix, payload, error.message, error.stack);
		} else {
			// tslint:disable-next-line
			console.log(prefix, payload);
		}
	}

	private getNow(): string {
		const now = new Date();

		return now.getUTCFullYear()
			+ "-"
			+ now.getUTCMonth()
			+ ":"
			+ now.getUTCDate()
			+ ":"
			+ now.getUTCHours()
			+ ":"
			+ now.getUTCMinutes()
			+ ":"
			+ now.getUTCSeconds()
			+ ":"
			+ now.getUTCMilliseconds();
	}

}

export default ConsoleOutputStrategy;
