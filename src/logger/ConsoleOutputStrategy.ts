import Level from "./Level";
import Logger from "./Logger";
import OutputStrategy from "./OutputStrategy";

class ConsoleOutputStrategy implements OutputStrategy {

	private static getNow(): string {
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

	public log(logger: Logger, level: Level, payload: any, error?: Error): void {
		const wkTStamp = ConsoleOutputStrategy.getNow();
		const prefix = wkTStamp + " " + level + " [" + logger.getName() + "]";

		if (level !== Level.DISABLE) {
			if (error) {
				switch (level) {
					case Level.ERROR:
					case Level.FATAL:
					default:
						// tslint:disable-next-line
						console.error(prefix, error.stack);
						break;
				}
			} else {
				switch (level) {
					case Level.DEBUG:
						// tslint:disable-next-line
						console.debug(prefix, payload);
						break;
					case Level.INFO:
						// tslint:disable-next-line
						console.info(prefix, payload);
						break;
					case Level.TRACE:
						// tslint:disable-next-line
						console.trace(prefix, payload);
						break;
					default:
						// tslint:disable-next-line
						console.log(prefix, payload);
						break;
				}
			}
		}
	}

}

export default ConsoleOutputStrategy;
