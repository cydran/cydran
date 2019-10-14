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
		const prefix = wkTStamp + " " + level + " [" + logger.getName() + "] %s - %s";

		const modLevel = (payload instanceof Error) ? Level.ERROR : level;
		if (modLevel !== Level.DISABLE) {
			if (modLevel >= Level.ERROR) {
				const errmsg = (error) ? payload : " ";
				const output = (error) ? error.stack : payload.stack;
				switch (modLevel) {
					case Level.ERROR:
					case Level.FATAL:
					default:
						// tslint:disable-next-line
						console.error(prefix, payload, output);
						break;
				}
			} else {
				switch (modLevel) {
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
